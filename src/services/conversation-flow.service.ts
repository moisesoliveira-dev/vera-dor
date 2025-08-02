import { Injectable, Logger } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { MessageService } from './message.service';
import { messagesConfig } from '../config/messages.config';

@Injectable()
export class ConversationFlowService {
    private readonly logger = new Logger(ConversationFlowService.name);

    constructor(
        private readonly conversationService: ConversationService,
        private readonly messageService: MessageService,
    ) { }

    /**
     * Processa uma mensagem recebida do usuário
     */
    async processUserMessage(
        contactId: number,
        ticketId: number,
        contactName: string,
        contactPhone: string,
        userMessage: string
    ): Promise<void> {
        try {
            this.logger.log(`Processando mensagem do usuário: "${userMessage}" para contactId: ${contactId}`);

            // Busca conversa ativa ou cria uma nova
            let conversation = await this.conversationService.findActiveByContactId(contactId);

            if (!conversation) {
                this.logger.log('Criando nova conversa...');
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
                ticketId
            );

        } catch (error) {
            this.logger.error('Erro ao processar mensagem do usuário:', error);
            await this.sendErrorMessage(ticketId);
        }
    }

    /**
     * Processa a mensagem baseada no passo atual da conversa
     */
    private async processMessageForStep(
        conversation: any,
        userMessage: string,
        ticketId: number
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
            await this.handleTextInput(conversation, userMessage, ticketId);
            return;
        }

        // Se o passo espera arquivo
        if (currentStep.expectsFile) {
            await this.handleFileInput(conversation, userMessage, ticketId);
            return;
        }

        // Processa opções numéricas
        await this.handleNumericOption(conversation, userMessage, ticketId, currentStep);
    }

    /**
     * Processa entrada de texto livre (como nome)
     */
    private async handleTextInput(
        conversation: any,
        userMessage: string,
        ticketId: number
    ): Promise<void> {
        const currentStep = messagesConfig.conversationFlow[conversation.currentStep];

        // Verifica se é uma opção especial (0, 10)
        if (currentStep.specialActions && currentStep.specialActions[userMessage]) {
            const nextStep = currentStep.specialActions[userMessage];
            await this.goToStep(conversation.contactId, ticketId, nextStep);
            return;
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
        ticketId: number
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
     * Processa opção numérica
     */
    private async handleNumericOption(
        conversation: any,
        userMessage: string,
        ticketId: number,
        currentStep: any
    ): Promise<void> {
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
}
