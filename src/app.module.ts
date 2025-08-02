import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookController } from './controllers/webhook.controller';
import { MessageController } from './controllers/message.controller';
import { ChatbotService } from './services/chatbot.service';
import { ContactService } from './services/contact.service';
import { MessageService } from './services/message.service';
import { ConversationService } from './services/conversation.service';
import { ConversationFlowService } from './services/conversation-flow.service';
import { DebounceService } from './services/debounce.service';
import { MessageValidationService } from './services/message-validation.service';
import { GoogleDriveService } from './services/google-drive.service';
import { Contact } from './entities/contact.entity';
import { Conversation } from './entities/conversation.entity';
import { databaseConfig, isDevelopment } from './config/database.config';

// Configuração condicional baseada no ambiente
const databaseModule = isDevelopment
  ? [] // Sem banco em desenvolvimento local
  : [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: databaseConfig.current.host,
      port: databaseConfig.current.port,
      username: databaseConfig.current.username,
      password: databaseConfig.current.password,
      database: databaseConfig.current.database,
      entities: [Contact, Conversation],
      synchronize: true, // Criar tabelas automaticamente em produção
      logging: false, // Desabilitar logs em produção
      ssl: process.env.NODE_ENV === 'production', // SSL em produção
    }),
    TypeOrmModule.forFeature([Contact, Conversation]),
  ];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...databaseModule,
  ],
  controllers: [AppController, WebhookController, MessageController],
  providers: [AppService, ChatbotService, ContactService, MessageService, ConversationService, ConversationFlowService, DebounceService, MessageValidationService, GoogleDriveService],
})
export class AppModule { }
