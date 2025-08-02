import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { messagesConfig } from '../config/messages.config';

@Injectable()
export class MessageService {
    private readonly logger = new Logger(MessageService.name);

    /**
     * Envia uma mensagem para um ticket específico
     */
    async sendMessage(ticketId: number, messageContent: string): Promise<boolean> {
        try {
            const url = `${messagesConfig.api.baseUrl}/${ticketId}`;

            this.logger.log(`Enviando mensagem para ticket ${ticketId}`);
            this.logger.log(`URL: ${url}`);
            this.logger.log(`Conteúdo: ${messageContent.substring(0, 100)}...`);

            const response = await axios.post(url, {
                body: messageContent
            }, {
                headers: {
                    'Authorization': messagesConfig.api.authorization,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 segundos de timeout
            });

            this.logger.log(`Mensagem enviada com sucesso. Status: ${response.status}`);
            return true;

        } catch (error) {
            this.logger.error('Erro ao enviar mensagem:', error.message);
            if (error.response) {
                this.logger.error(`Status: ${error.response.status}`);
                this.logger.error(`Data: ${JSON.stringify(error.response.data)}`);
            }
            return false;
        }
    }

    /**
     * Envia mensagem de boas-vindas
     */
    async sendWelcomeMessage(ticketId: number): Promise<boolean> {
        const template = messagesConfig.templates.welcome;
        this.logger.log(`Enviando mensagem de boas-vindas (${template.title}) para ticket ${ticketId}`);
        return this.sendMessage(ticketId, template.message);
    }

    /**
     * Envia mensagem fora do horário
     */
    async sendOutsideHoursMessage(ticketId: number): Promise<boolean> {
        const template = messagesConfig.templates.outsideHours;
        this.logger.log(`Enviando mensagem fora do horário (${template.title}) para ticket ${ticketId}`);
        return this.sendMessage(ticketId, template.message);
    }

    /**
     * Envia mensagem de erro
     */
    async sendErrorMessage(ticketId: number): Promise<boolean> {
        const template = messagesConfig.templates.error;
        this.logger.log(`Enviando mensagem de erro (${template.title}) para ticket ${ticketId}`);
        return this.sendMessage(ticketId, template.message);
    }

    /**
     * Lista todas as mensagens disponíveis (para facilitar visualização)
     */
    getAvailableMessages() {
        return Object.entries(messagesConfig.templates).map(([key, template]) => ({
            id: template.id,
            title: template.title,
            preview: template.message.substring(0, 100) + '...',
            fullMessage: template.message
        }));
    }

    /**
     * Atualiza uma mensagem específica (para facilitar alterações)
     */
    updateMessage(messageId: string, newContent: string): boolean {
        try {
            const template = Object.values(messagesConfig.templates).find(t => t.id === messageId);
            if (template) {
                template.message = newContent;
                this.logger.log(`Mensagem ${messageId} atualizada com sucesso`);
                return true;
            }
            this.logger.warn(`Mensagem ${messageId} não encontrada`);
            return false;
        } catch (error) {
            this.logger.error(`Erro ao atualizar mensagem ${messageId}:`, error);
            return false;
        }
    }
}
