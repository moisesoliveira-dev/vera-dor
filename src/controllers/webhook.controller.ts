import { Controller, Post, Body, Logger } from '@nestjs/common';
import { WebhookPayloadDto } from '../dto/webhook.dto';
import { WebhookPayload } from '../interfaces/webhook.interface';
import { ConversationFlowService } from '../services/conversation-flow.service';

@Controller('webhook')
export class WebhookController {
    private readonly logger = new Logger(WebhookController.name);

    constructor(private readonly conversationFlowService: ConversationFlowService) { }

    @Post()
    async receiveWebhook(@Body() payload: WebhookPayloadDto): Promise<{ success: boolean; message: string }> {
        try {
            this.logger.log('Webhook recebido:', JSON.stringify(payload, null, 2));

            // Aqui você pode processar os dados do webhook
            const messageData = payload.data;

            this.logger.log(`Nova mensagem recebida:`);
            this.logger.log(`- ID da mensagem: ${messageData.messageId}`);
            this.logger.log(`- Tipo do payload: ${payload.type}`);
            this.logger.log(`- Conteúdo: ${messageData.body}`);
            this.logger.log(`- De: ${messageData.contact.name} (${messageData.contact.number})`);
            this.logger.log(`- Ticket ID: ${messageData.ticketId}`);
            this.logger.log(`- É do usuário: ${messageData.fromMe ? 'Sim' : 'Não'}`);
            this.logger.log(`- Status do ticket: ${messageData.ticket.status}`);

            // Não processar mensagens enviadas por nós mesmos
            if (messageData.fromMe) {
                this.logger.log('Mensagem enviada por nós - ignorando');
                return {
                    success: true,
                    message: 'Mensagem própria ignorada'
                };
            }

            // Processar mensagem com debounce no serviço de fluxo de conversa
            await this.conversationFlowService.processWebhookMessage(messageData as any);

            return {
                success: true,
                message: 'Webhook processado com sucesso'
            };
        } catch (error) {
            this.logger.error('Erro ao processar webhook:', error);
            return {
                success: false,
                message: 'Erro ao processar webhook'
            };
        }
    }
}
