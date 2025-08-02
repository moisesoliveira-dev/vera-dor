import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { MessageService } from '../services/message.service';

@Controller('messages')
export class MessageController {
    private readonly logger = new Logger(MessageController.name);

    constructor(private readonly messageService: MessageService) { }

    /**
     * Lista todas as mensagens disponíveis
     */
    @Get()
    getMessages() {
        this.logger.log('Listando todas as mensagens disponíveis');
        return {
            success: true,
            messages: this.messageService.getAvailableMessages()
        };
    }

    /**
     * Envia uma mensagem de teste para um ticket
     */
    @Post('test/:ticketId')
    async sendTestMessage(
        @Param('ticketId') ticketId: number,
        @Body() body: { messageId: string }
    ) {
        this.logger.log(`Enviando mensagem de teste ${body.messageId} para ticket ${ticketId}`);

        let success = false;

        switch (body.messageId) {
            case 'welcome':
                success = await this.messageService.sendWelcomeMessage(ticketId);
                break;
            case 'outsideHours':
                success = await this.messageService.sendOutsideHoursMessage(ticketId);
                break;
            case 'error':
                success = await this.messageService.sendErrorMessage(ticketId);
                break;
            default:
                return {
                    success: false,
                    message: 'ID de mensagem inválido. Use: welcome, outsideHours ou error'
                };
        }

        return {
            success,
            message: success ? 'Mensagem enviada com sucesso' : 'Erro ao enviar mensagem'
        };
    }

    /**
     * Atualiza o conteúdo de uma mensagem
     */
    @Post('update')
    updateMessage(@Body() body: { messageId: string; content: string }) {
        this.logger.log(`Atualizando mensagem ${body.messageId}`);

        const success = this.messageService.updateMessage(body.messageId, body.content);

        return {
            success,
            message: success ? 'Mensagem atualizada com sucesso' : 'Erro ao atualizar mensagem'
        };
    }

    /**
     * Envia uma mensagem personalizada
     */
    @Post('send/:ticketId')
    async sendCustomMessage(
        @Param('ticketId') ticketId: number,
        @Body() body: { message: string }
    ) {
        this.logger.log(`Enviando mensagem personalizada para ticket ${ticketId}`);

        const success = await this.messageService.sendMessage(ticketId, body.message);

        return {
            success,
            message: success ? 'Mensagem enviada com sucesso' : 'Erro ao enviar mensagem'
        };
    }
}
