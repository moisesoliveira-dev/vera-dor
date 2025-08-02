# Sistema de Chatbot Vera-Dor - Configuração Completa

## 🗄️ Banco de Dados PostgreSQL

### Configurações de Conexão
- **Host**: postgres.railway.internal
- **Database**: railway
- **User**: postgres
- **Password**: RdpmtkgDGbpDvvFJgnUkoEKCxIewremX

### Tabela: tb_contact
```sql
CREATE TABLE tb_contact (
  id SERIAL PRIMARY KEY,
  mediapath TEXT,
  body TEXT,
  mediatype TEXT,
  ticketid INTEGER,
  contactid INTEGER,
  userid INTEGER,
  nome TEXT,
  ematendimento BOOLEAN DEFAULT FALSE,
  finalizoutriagem BOOLEAN DEFAULT FALSE,
  stopchatbot BOOLEAN DEFAULT FALSE,
  templateid INTEGER,
  pararmensagem BOOLEAN DEFAULT FALSE,
  lastmessage TEXT,
  state INTEGER,
  fase_arquivos TEXT,
  id_atendente INTEGER,
  numero TEXT,
  local TEXT,
  id_queue INTEGER,
  mensagem_invalida BOOLEAN DEFAULT FALSE
);
```

## 🔧 Regras de Negócio Implementadas

### 1. Filtro de Teste
- **Apenas processa mensagens do contactId: 24914**
- Outras mensagens são ignoradas durante o desenvolvimento

### 2. Fluxo de Processamento
1. **Recebe webhook** → Valida dados
2. **Filtra por contactId** → Só processa ID de teste
3. **Busca no banco** → Verifica se contato existe
4. **Novo contato?** → Cria registro + Envia boas-vindas
5. **Contato existe?** → Atualiza última mensagem

### 3. Estados do Contato
- `ematendimento`: Se está em atendimento humano
- `stopchatbot`: Se o chatbot está pausado
- `finalizoutriagem`: Se finalizou triagem
- `mensagem_invalida`: Se última mensagem foi inválida

## 📡 API de Mensagens

### Configuração
- **URL Base**: https://cmmodulados.gosac.com.br/api/messages/[ticketId]
- **Authorization**: INTEGRATION 1f7e1c970adf60b4ac6dc56afbc4edcd3ed52de8656fb38f7e899bff6889

### Endpoints para Envio
```bash
POST /api/messages/{ticketId}
Headers: Authorization: INTEGRATION {token}
Body: { "body": "Mensagem a ser enviada" }
```

## 🤖 Mensagens Configuradas

### 1. Boas-vindas (welcome)
Enviada automaticamente para novos contatos.

### 2. Fora do Horário (outsideHours)
Para mensagens recebidas fora do horário comercial.

### 3. Erro (error)
Enviada quando há problemas técnicos.

## 🛠️ Endpoints da API

### Webhook
```
POST /webhook
```
Recebe dados do sistema externo e processa mensagens.

### Gerenciamento de Mensagens
```
GET /messages                    # Lista todas as mensagens
POST /messages/test/{ticketId}   # Envia mensagem de teste
POST /messages/update            # Atualiza conteúdo de mensagem
POST /messages/send/{ticketId}   # Envia mensagem personalizada
```

### Exemplos de Uso

#### Listar Mensagens Disponíveis
```bash
GET http://localhost:3000/messages
```

#### Enviar Mensagem de Boas-vindas para Teste
```bash
POST http://localhost:3000/messages/test/16687
Content-Type: application/json

{
  "messageId": "welcome"
}
```

#### Atualizar Conteúdo de Mensagem
```bash
POST http://localhost:3000/messages/update
Content-Type: application/json

{
  "messageId": "welcome",
  "content": "Nova mensagem de boas-vindas personalizada"
}
```

## 📂 Estrutura de Arquivos

### Configurações
- `src/config/database.config.ts` - Configurações do PostgreSQL
- `src/config/messages.config.ts` - Mensagens e configurações da API

### Entidades
- `src/entities/contact.entity.ts` - Entidade da tabela tb_contact

### Serviços
- `src/services/chatbot.service.ts` - Lógica principal do chatbot
- `src/services/contact.service.ts` - Operações com banco de dados
- `src/services/message.service.ts` - Envio de mensagens via API

### Controllers
- `src/controllers/webhook.controller.ts` - Recebe webhooks
- `src/controllers/message.controller.ts` - Gerencia mensagens

## 🚀 Como Executar

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

### Teste de Webhook
Envie POST para `http://localhost:3000/webhook` com dados do exemplo.

## 📊 Logs e Monitoramento

O sistema gera logs detalhados para:
- Processamento de mensagens
- Consultas no banco de dados
- Envio de mensagens via API
- Erros e exceções

### Exemplo de Log
```
[ChatbotService] Processando mensagem de kassio Costa (contactId: 24914)
[ContactService] Buscando contato com contactId: 24914
[ContactService] Nenhum contato encontrado com contactId: 24914
[ContactService] Criando novo contato no banco de dados
[MessageService] Enviando mensagem de boas-vindas para ticket 16687
```

## 🔍 Facilidades para Desenvolvimento

### Visualização de Mensagens
Acesse `GET /messages` para ver todas as mensagens configuradas com preview.

### Teste Rápido
Use `POST /messages/test/{ticketId}` para testar qualquer mensagem rapidamente.

### Atualização Dinâmica
Altere mensagens em tempo real com `POST /messages/update`.

### Filtro de Teste
Apenas o contactId 24914 é processado durante desenvolvimento.
