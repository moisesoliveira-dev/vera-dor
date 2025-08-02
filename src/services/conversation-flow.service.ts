import { Injectable, Logger } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { MessageService } from './message.service';
import { DebounceService } from './debounce.service';
import { MessageValidationService } from './message-validation.service';
import { GoogleDriveService } from './google-drive.service';
import { messagesConfig } from '../config/messages.config';

@Injectable()
export class ConversationFlowService {
    private readonly logger = new Logger(ConversationFlowService.name);

    constructor(
        private readonly conversationService: ConversationService,
        private readonly messageService: MessageService,
        private readonly debounceService: DebounceService,
        private readonly messageValidationService: MessageValidationService,
        private readonly googleDriveService: GoogleDriveService,
    ) { }

    /**
     * Processa uma mensagem recebida do webhook com debounce
     */
    async processWebhookMessage(webhookData: any): Promise<void> {
        const contactId = webhookData.contactId;
        const ticketId = webhookData.ticketId;

        // Verificar se é o contato de teste
        if (contactId !== messagesConfig.testContactId) {
            this.logger.log(`Mensagem ignorada - contactId ${contactId} não é o contato de teste`);
            return;
        }

        this.logger.log(`📨 Mensagem recebida para contactId: ${contactId}`);

        // Aplicar debounce de 3 segundos
        this.debounceService.debounceMessage(contactId, webhookData, async (debouncedData) => {
            await this.processUserMessage(
                debouncedData.contactId,
                debouncedData.ticketId,
                debouncedData.contact?.name || 'Cliente',
                debouncedData.contact?.phone || '',
                debouncedData.data?.message?.text || '',
                debouncedData
            );
        });
    }

    /**
     * Processa uma mensagem recebida do usuário
     */
    async processUserMessage(
        contactId: number,
        ticketId: number,
        contactName: string,
        contactPhone: string,
        userMessage: string,
        webhookData?: any
    ): Promise<void> {
        try {
            this.logger.log(`🔄 Processando mensagem: "${userMessage}" para contactId: ${contactId}`);

            // Busca conversa ativa ou cria uma nova
            let conversation = await this.conversationService.findActiveByContactId(contactId);

            if (!conversation) {
                this.logger.log('✨ Criando nova conversa...');
                conversation = await this.conversationService.createConversation({
                    contactId,
                    ticketId,
                    contactName,
                    contactPhone,
                    currentStep: 'welcome'
                });
            }

            // Processa a mensagem baseada no passo atual
            await this.processMessageForStep(
                conversation,
                userMessage.trim(),
                ticketId,
                webhookData
            );

        } catch (error) {
            this.logger.error('❌ Erro ao processar mensagem do usuário:', error);
            await this.sendErrorMessage(ticketId);
        }
    }

    /**
     * Processa a mensagem baseada no passo atual da conversa
     */
    private async processMessageForStep(
        conversation: any,
        userMessage: string,
        ticketId: number,
        webhookData?: any
    ): Promise<void> {
        const currentStep = messagesConfig.conversationFlow[conversation.currentStep];

        if (!currentStep) {
            this.logger.error(`Passo não encontrado: ${conversation.currentStep}`);
            await this.restartConversation(conversation.contactId, ticketId);
            return;
        }

        this.logger.log(`Processando passo: ${currentStep.id}`);

        // Se o passo espera texto livre (como nome)
        if (currentStep.expectsText) {
            await this.handleTextInput(conversation, userMessage, ticketId, webhookData);
            return;
        }

        // Se o passo espera arquivo
        if (currentStep.expectsFile) {
            await this.handleFileInput(conversation, userMessage, ticketId, webhookData);
            return;
        }

        // Processa opções numéricas
        await this.handleNumericOption(conversation, userMessage, ticketId, currentStep, webhookData);
    }

    /**
     * Processa entrada de texto livre (como nome) com validação de tipo
     */
    private async handleTextInput(
        conversation: any,
        userMessage: string,
        ticketId: number,
        webhookData?: any
    ): Promise<void> {
        const currentStep = messagesConfig.conversationFlow[conversation.currentStep];

        // Verificar se é uma opção especial primeiro (0, 10)
        if (currentStep.specialActions && currentStep.specialActions[userMessage]) {
            const nextStep = currentStep.specialActions[userMessage];
            await this.goToStep(conversation.contactId, ticketId, nextStep);
            return;
        }

        // Validar se é texto (tipo chat) - somente para entrada de nome
        if (webhookData && currentStep.id === 'ask_name_option1') {
            const validation = this.messageValidationService.validateNameInput(webhookData);

            if (!validation.isValid) {
                if (validation.shouldRespond) {
                    // Enviar mensagem de erro apenas uma vez
                    const errorMessage = this.messageValidationService.getNameValidationErrorMessage();
                    await this.messageService.sendMessage(ticketId, errorMessage);
                    this.logger.log(`⚠️ Enviado aviso de tipo inválido para contactId: ${conversation.contactId}`);
                }
                // Não processar mais, apenas ignorar
                return;
            }
        }

        // Se não é uma opção especial, considera como texto do usuário
        if (userMessage && userMessage.length > 0) {
            // Salva o nome no stepData
            const stepData = conversation.stepData || {};
            stepData.userName = userMessage;

            await this.conversationService.updateConversationStep(
                conversation.contactId,
                currentStep.nextStep,
                stepData,
                userMessage
            );

            // Vai para o próximo passo
            await this.goToStep(conversation.contactId, ticketId, currentStep.nextStep);
        } else {
            // Entrada inválida
            await this.sendInvalidOptionMessage(ticketId);
        }
    }

    /**
     * Processa upload de arquivo
     */
    private async handleFileInput(
        conversation: any,
        userMessage: string,
        ticketId: number,
        webhookData?: any
    ): Promise<void> {
        const currentStep = messagesConfig.conversationFlow[conversation.currentStep];

        // Verifica se é uma opção especial (0, 10)
        if (currentStep.specialActions && currentStep.specialActions[userMessage]) {
            const nextStep = currentStep.specialActions[userMessage];
            await this.goToStep(conversation.contactId, ticketId, nextStep);
            return;
        }

        // Por enquanto, considera qualquer mensagem como "arquivo enviado"
        // Depois você pode implementar validação de mídia real
        this.logger.log('Arquivo/mensagem recebido, prosseguindo para próximo passo');

        await this.conversationService.updateConversationStep(
            conversation.contactId,
            currentStep.nextStep,
            conversation.stepData,
            'Arquivo enviado'
        );

        await this.goToStep(conversation.contactId, ticketId, currentStep.nextStep);
    }

    /**
     * Processa opção numérica com validação avançada
     */
    private async handleNumericOption(
        conversation: any,
        userMessage: string,
        ticketId: number,
        currentStep: any,
        webhookData?: any
    ): Promise<void> {
        // Para confirmação de nome, validar tipo de mensagem
        if (webhookData && currentStep.id === 'confirm_name_option1') {
            const validation = this.messageValidationService.validateOptionInput(webhookData, currentStep.validOptions);

            if (!validation.isValid) {
                if (validation.shouldRespond) {
                    // Enviar mensagem de erro apenas uma vez
                    const errorMessage = this.messageValidationService.getOptionValidationErrorMessage(currentStep.validOptions);
                    await this.messageService.sendMessage(ticketId, errorMessage);
                    this.logger.log(`⚠️ Enviado aviso de opção inválida para contactId: ${conversation.contactId}`);
                }
                // Não processar mais, apenas ignorar
                return;
            }
        }

        // Verifica se é uma opção válida
        if (currentStep.validOptions && currentStep.validOptions.includes(userMessage)) {
            let nextStep: string | undefined;

            // Se tem ações especiais (como voltar ou reiniciar)
            if (currentStep.specialActions && currentStep.specialActions[userMessage]) {
                nextStep = currentStep.specialActions[userMessage];
            } else if (currentStep.nextStep) {
                // Se nextStep é um objeto com mapeamento
                if (typeof currentStep.nextStep === 'object') {
                    nextStep = currentStep.nextStep[userMessage];
                } else {
                    // Se nextStep é uma string simples
                    nextStep = currentStep.nextStep;
                }
            }

            if (nextStep) {
                // Criar pasta no Google Drive quando confirmar nome (opção 1 no confirm_name_option1)
                if (currentStep.id === 'confirm_name_option1' && userMessage === '1') {
                    await this.createClientGoogleDriveFolder(conversation);
                }

                await this.conversationService.updateConversationStep(
                    conversation.contactId,
                    nextStep,
                    conversation.stepData,
                    userMessage
                );

                await this.goToStep(conversation.contactId, ticketId, nextStep);
            } else {
                this.logger.error(`Próximo passo não definido para opção: ${userMessage}`);
                await this.sendInvalidOptionMessage(ticketId);
            }
        } else {
            // Opção inválida
            await this.sendInvalidOptionMessage(ticketId);
        }
    }

    /**
     * Vai para um passo específico e envia a mensagem
     */
    private async goToStep(contactId: number, ticketId: number, stepId: string): Promise<void> {
        const step = messagesConfig.conversationFlow[stepId];

        if (!step) {
            this.logger.error(`Passo não encontrado: ${stepId}`);
            await this.restartConversation(contactId, ticketId);
            return;
        }

        this.logger.log(`Enviando mensagem do passo: ${step.title}`);

        // Se é um passo de transferência para humano
        if (step.isTransferStep) {
            await this.handleTransferToHuman(contactId, ticketId, step);
            return;
        }

        // Personaliza a mensagem se necessário
        let message = step.message;

        // Busca dados da conversa para personalização
        const conversation = await this.conversationService.findActiveByContactId(contactId);
        if (conversation && conversation.stepData && conversation.stepData.userName) {
            message = message.replace('[nome]', conversation.stepData.userName);
        }

        // Envia a mensagem
        await this.messageService.sendMessage(ticketId, message);
    }

    /**
     * Manipula transferência para atendimento humano
     */
    private async handleTransferToHuman(contactId: number, ticketId: number, step: any): Promise<void> {
        // Busca dados da conversa para personalização
        const conversation = await this.conversationService.findActiveByContactId(contactId);
        let message = step.message;

        if (conversation && conversation.stepData && conversation.stepData.userName) {
            message = message.replace('[nome]', conversation.stepData.userName);
        }

        // Envia mensagem de transferência
        await this.messageService.sendMessage(ticketId, message);

        // Finaliza a conversa (transfere para humano)
        await this.conversationService.finalizeConversation(contactId);

        this.logger.log(`Conversa transferida para atendimento humano - ContactId: ${contactId}`);
    }

    /**
     * Envia mensagem de opção inválida
     */
    private async sendInvalidOptionMessage(ticketId: number): Promise<void> {
        const message = messagesConfig.systemMessages.invalidOption.message;
        await this.messageService.sendMessage(ticketId, message);
    }

    /**
     * Envia mensagem de erro
     */
    private async sendErrorMessage(ticketId: number): Promise<void> {
        const message = messagesConfig.systemMessages.error.message;
        await this.messageService.sendMessage(ticketId, message);
    }

    /**
     * Reinicia uma conversa
     */
    private async restartConversation(contactId: number, ticketId: number): Promise<void> {
        this.logger.log(`Reiniciando conversa para contactId: ${contactId}`);

        await this.conversationService.restartConversation(contactId);
        await this.goToStep(contactId, ticketId, 'welcome');
    }

    /**
     * Cria pasta no Google Drive para o cliente
     */
    private async createClientGoogleDriveFolder(conversation: any): Promise<void> {
        try {
            const clientName = conversation.stepData?.userName || conversation.contactName;
            const contactId = conversation.contactId;

            this.logger.log(`📁 Tentando criar pasta no Google Drive para: ${clientName} (ID: ${contactId})`);

            if (!this.googleDriveService.isReady()) {
                this.logger.warn('⚠️ Google Drive não configurado - pasta não será criada');
                this.logger.log('📋 Configure as credenciais do Google Drive:');
                this.logger.log(this.googleDriveService.getSetupInstructions());
                return;
            }

            const folder = await this.googleDriveService.createClientFolder(
                clientName,
                contactId
            );

            if (folder) {
                // Salvar informações da pasta no stepData
                const stepData = conversation.stepData || {};
                stepData.googleDriveFolder = {
                    id: folder.id,
                    name: folder.name,
                    link: folder.webViewLink,
                    createdAt: folder.createdTime
                };

                await this.conversationService.updateConversationStep(
                    contactId,
                    conversation.currentStep, // Manter o mesmo step
                    stepData,
                    conversation.lastMessage
                );

                this.logger.log(`✅ Pasta criada com sucesso: ${folder.name}`);
                this.logger.log(`🔗 Link: ${folder.webViewLink}`);
            } else {
                this.logger.error('❌ Falha ao criar pasta no Google Drive');
            }

        } catch (error) {
            this.logger.error('❌ Erro ao criar pasta no Google Drive:', error);
        }
    }
}
