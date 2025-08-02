import { Injectable, Logger } from '@nestjs/common';
import { WebhookMessageData } from '../interfaces/webhook.interface';
import { ConversationFlowService } from './conversation-flow.service';
import { messagesConfig } from '../config/messages.config';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  constructor(
    private readonly conversationFlowService: ConversationFlowService,
  ) {}

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
      // Processa a mensagem através do fluxo de conversação
      await this.conversationFlowService.processUserMessage(
        messageData.contactId,
        messageData.ticketId,
        messageData.contact.name,
        messageData.contact.number,
        messageData.body
      );

      this.logger.log('Mensagem processada com sucesso através do fluxo de conversação');

    } catch (error) {
      this.logger.error('Erro ao processar mensagem:', error);
    }
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
