import { Injectable, Logger } from '@nestjs/common';
import { WebhookMessageData } from '../interfaces/webhook.interface';
import { ContactService } from './contact.service';
import { MessageService } from './message.service';
import { messagesConfig } from '../config/messages.config';

@Injectable()
export class ChatbotService {
    private readonly logger = new Logger(ChatbotService.name);

    constructor(
        private readonly contactService: ContactService,
        private readonly messageService: MessageService,
    ) { }

    /**
     * Processa uma mensagem recebida via webhook
     */
    async processMessage(messageData: WebhookMessageData): Promise<void> {
        this.logger.log(`Processando mensagem de ${messageData.contact.name} (contactId: ${messageData.contactId})`);

        // Filtro de teste - apenas processa mensagens do contato de teste
        if (messageData.contactId !== messagesConfig.testContactId) {
            this.logger.log(`Mensagem ignorada - contactId ${messageData.contactId} não é o ID de teste (${messagesConfig.testContactId})`);
            return;
        }

        // Ignora mensagens enviadas pelo próprio bot
        if (messageData.fromMe) {
            this.logger.log('Mensagem ignorada - enviada pelo bot');
            return;
        }

        // Verifica se a mensagem deve ser processada
        if (!this.shouldProcessMessage(messageData)) {
            this.logger.log('Mensagem ignorada - não atende critérios de processamento');
            return;
        }

        try {
            // Busca ou cria o contato no banco de dados
            const contact = await this.findOrCreateContact(messageData);

            // Verifica se deve processar a mensagem baseado no status do contato
            const shouldProcess = await this.contactService.shouldProcessMessage(messageData.contactId);
            if (!shouldProcess) {
                this.logger.log('Mensagem não processada - contato em atendimento ou chatbot pausado');
                return;
            }

            // Atualiza a última mensagem do contato
            await this.contactService.updateLastMessage(messageData.contactId, messageData.body);

            // Se é um novo contato, envia mensagem de boas-vindas
            if (!contact) {
                this.logger.log('Enviando mensagem de boas-vindas para novo contato');
                await this.messageService.sendWelcomeMessage(messageData.ticketId);
            } else {
                this.logger.log('Contato já existe - mensagem processada e salva');
            }

            // Extrai informações principais da mensagem para log
            const messageInfo = this.extractMessageInfo(messageData);
            this.logger.log('Dados processados:', JSON.stringify(messageInfo, null, 2));

        } catch (error) {
            this.logger.error('Erro ao processar mensagem:', error);

            // Envia mensagem de erro em caso de falha
            try {
                await this.messageService.sendErrorMessage(messageData.ticketId);
            } catch (sendError) {
                this.logger.error('Erro ao enviar mensagem de erro:', sendError);
            }
        }
    }

    /**
     * Busca um contato existente ou cria um novo
     */
    private async findOrCreateContact(messageData: WebhookMessageData): Promise<boolean> {
        const existingContact = await this.contactService.findByContactId(messageData.contactId);

        if (existingContact) {
            this.logger.log(`Contato existente encontrado: ${existingContact.nome}`);
            return true; // Contato já existe
        }

        // Cria novo contato
        this.logger.log('Criando novo contato no banco de dados');

        const newContact = {
            contactid: messageData.contactId,
            ticketid: messageData.ticketId,
            nome: messageData.contact.name,
            numero: messageData.contact.number,
            body: messageData.body,
            mediatype: messageData.mediaType,
            mediapath: messageData.mediaPath || undefined,
            lastmessage: messageData.body,
            ematendimento: false,
            finalizoutriagem: false,
            stopchatbot: false,
            pararmensagem: false,
            mensagem_invalida: false,
            state: 0,
        };

        await this.contactService.createContact(newContact);
        return false; // Novo contato criado
    }    /**
     * Extrai e mapeia as informações principais da mensagem
     */
    private extractMessageInfo(messageData: WebhookMessageData) {
        return {
            // Dados da mensagem
            message: {
                id: messageData.messageId,
                content: messageData.body,
                mediaType: messageData.mediaType,
                mediaUrl: messageData.mediaUrl,
                isDeleted: messageData.isDeleted,
                isForwarded: messageData.isForwarded,
                sentAt: messageData.createdAt,
                ack: messageData.ack,
                read: messageData.read
            },

            // Dados do contato
            contact: {
                id: messageData.contact.id,
                name: messageData.contact.name,
                phone: messageData.contact.number,
                email: messageData.contact.email,
                profilePicUrl: messageData.contact.profilePicUrl,
                isGroup: messageData.contact.isGroup,
                hasWhatsapp: messageData.contact.hasWhatsapp,
                document: messageData.contact.document,
                company: messageData.contact.company,
                isBlacklisted: messageData.contact.blacklist
            },

            // Dados do ticket/conversa
            ticket: {
                id: messageData.ticket.id,
                status: messageData.ticket.status,
                protocol: messageData.ticket.protocol,
                unreadMessages: messageData.ticket.unreadMessages,
                lastAction: messageData.ticket.lastAction,
                origin: messageData.ticket.origin,
                createdAt: messageData.ticket.createdAt,
                lastMessageAt: messageData.ticket.lastMessageAt,
                isGroup: messageData.ticket.isGroup,
                userId: messageData.ticket.userId,
                queueId: messageData.ticket.queueId
            },

            // Dados da conexão WhatsApp
            whatsapp: {
                id: messageData.ticket.whatsapp.id,
                name: messageData.ticket.whatsapp.name,
                phoneNumber: messageData.ticket.whatsapp.phoneNumber,
                status: messageData.ticket.whatsapp.status,
                battery: messageData.ticket.whatsapp.battery,
                plugged: messageData.ticket.whatsapp.plugged,
                type: messageData.ticket.whatsapp.type
            }
        };
    }

    /**
     * Verifica se a mensagem deve ser processada pelo bot
     */
    private shouldProcessMessage(messageData: WebhookMessageData): boolean {
        // Não processa mensagens do próprio bot
        if (messageData.fromMe) {
            return false;
        }

        // Não processa mensagens deletadas
        if (messageData.isDeleted) {
            return false;
        }

        // Não processa contatos na blacklist
        if (messageData.contact.blacklist) {
            return false;
        }

        return true;
    }
}
