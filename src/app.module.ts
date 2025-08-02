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
import { Contact } from './entities/contact.entity';
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
      entities: [Contact],
      synchronize: false,
      logging: true,
    }),
    TypeOrmModule.forFeature([Contact]),
  ];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...databaseModule,
  ],
  controllers: [AppController, WebhookController, MessageController],
  providers: [AppService, ChatbotService, ContactService, MessageService],
})
export class AppModule { }
