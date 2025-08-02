import { Injectable, Logger } from '@nestjs/common';
import { WebhookMessageData } from '../interfaces/webhook.interface';

@Injectable()
export class ChatbotService {
    private readonly logger = new Logger(ChatbotService.name);

    /**
     * Processa uma mensagem recebida via webhook
     */
    async processMessage(messageData: WebhookMessageData): Promise<void> {
        this.logger.log(`Processando mensagem de ${messageData.contact.name}`);

        // Ignora mensagens enviadas pelo próprio bot
        if (messageData.fromMe) {
            this.logger.log('Mensagem ignorada - enviada pelo bot');
            return;
        }

        // Extrai informações principais da mensagem
        const messageInfo = this.extractMessageInfo(messageData);

        this.logger.log('Dados extraídos da mensagem:', JSON.stringify(messageInfo, null, 2));

        // Aqui você pode implementar a lógica do chatbot
        // Por enquanto apenas logamos os dados mapeados
    }

    /**
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
