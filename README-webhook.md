# Chatbot Vera-Dor - Webhook Handler

Este projeto implementa um chatbot que recebe mensagens via webhook e processa automaticamente as interações.

## 🚀 Primeiros Passos

### Estrutura de Dados Mapeados

O webhook recebe dados completos do sistema de mensageria, incluindo:

- **Mensagem**: Conteúdo, tipo, status de leitura, mídia, etc.
- **Contato**: Nome, telefone, email, empresa, dados pessoais
- **Ticket/Conversa**: Status, protocolo, fila, histórico
- **Conexão WhatsApp**: Status da conexão, configurações, horários

### Arquivos Principais

- `src/interfaces/webhook.interface.ts` - Interfaces TypeScript para tipagem
- `src/dto/webhook.dto.ts` - DTOs para validação dos dados
- `src/controllers/webhook.controller.ts` - Controller que recebe o webhook
- `src/services/chatbot.service.ts` - Serviço que processa as mensagens
- `docs/webhook-mapping.md` - Documentação completa dos dados

## 📋 Exemplo de Dados Recebidos

```json
{
  "data": {
    "messageId": "3A2209CEC8650BBE5FD5",
    "body": "OK",
    "fromMe": false,
    "contact": {
      "name": "kassio Costa",
      "number": "559292319673"
    },
    "ticket": {
      "status": "pending",
      "protocol": "2025071913092893"
    }
  },
  "type": "messages:created"
}
```

## 🔧 Como Funciona

1. **Recebimento**: O webhook `/webhook` recebe os dados POST
2. **Validação**: Os dados são validados usando class-validator
3. **Mapeamento**: As informações são extraídas e organizadas
4. **Processamento**: A lógica do chatbot processa a mensagem
5. **Resposta**: Sistema retorna confirmação de recebimento

## 📊 Dados Extraídos Automaticamente

O serviço extrai e organiza:

```typescript
{
  message: {
    id: string,
    content: string,
    mediaType: string,
    sentAt: string
  },
  contact: {
    name: string,
    phone: string,
    company: string
  },
  ticket: {
    status: string,
    protocol: string
  },
  whatsapp: {
    status: string,
    phoneNumber: string
  }
}
```

## 🛠️ Próximos Passos

Com os dados mapeados, você pode implementar:

- Respostas automáticas
- Integração com IA
- Roteamento por departamentos
- Salvamento em banco de dados
- Analytics e relatórios

## 🚀 Executar o Projeto

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

O webhook estará disponível em: `http://localhost:3000/webhook`
