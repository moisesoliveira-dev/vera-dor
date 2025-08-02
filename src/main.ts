import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir requisições externas
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Vera D'Or Chatbot rodando na porta ${port}`);
  console.log(`📡 Webhook endpoint: /webhook`);
  console.log(`💬 Messages endpoint: /messages`);
}
bootstrap();
