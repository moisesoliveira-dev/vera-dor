import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookController } from './controllers/webhook.controller';
import { ChatbotService } from './services/chatbot.service';

@Module({
  imports: [],
  controllers: [AppController, WebhookController],
  providers: [AppService, ChatbotService],
})
export class AppModule { }
