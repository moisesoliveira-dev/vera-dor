# 🗄️ Estrutura do Banco de Dados - Chatbot Vera D'Or

## 📋 Visão Geral

Este documento descreve a estrutura das tabelas do banco de dados PostgreSQL para o chatbot Vera D'Or da Cinthia Moreira Modulados.

---

## 🎯 Tabelas Principais

### 1. **tb_conversation** (Conversas do Chatbot)

Esta tabela armazena o estado e histórico das conversações com os usuários.

#### 📝 Estrutura da Tabela:

| Campo | Tipo | Tamanho | Obrigatório | Descrição |
|-------|------|---------|-------------|-----------|
| `id` | INTEGER | - | ✅ | Chave primária auto-incremento |
| `contactId` | INTEGER | - | ✅ | ID único do contato (ÚNICO) |
| `ticketId` | INTEGER | - | ✅ | ID do ticket no sistema externo |
| `contactName` | VARCHAR | 100 | ✅ | Nome do contato/cliente |
| `contactPhone` | VARCHAR | 20 | ✅ | Telefone do contato |
| `currentStep` | VARCHAR | 50 | ✅ | Etapa atual na conversa (padrão: 'welcome') |
| `stepData` | JSON | - | ❌ | Dados temporários da conversa |
| `lastMessage` | VARCHAR | 200 | ❌ | Última mensagem recebida |
| `isActive` | BOOLEAN | - | ✅ | Conversa ativa (padrão: true) |
| `transferredToHuman` | BOOLEAN | - | ✅ | Transferido para humano (padrão: false) |
| `createdAt` | TIMESTAMP | - | ✅ | Data de criação |
| `updatedAt` | TIMESTAMP | - | ✅ | Data da última atualização |

#### 🔍 Índices:
- **Primary Key**: `id`
- **Unique Index**: `contactId` (um contato = uma conversa ativa)
- **Index**: `ticketId` (para consultas rápidas por ticket)

---

### 2. **tb_contact** (Contatos)

Tabela para armazenar informações dos contatos.

#### 📝 Estrutura da Tabela:

| Campo | Tipo | Tamanho | Obrigatório | Descrição |
|-------|------|---------|-------------|-----------|
| `id` | INTEGER | - | ✅ | Chave primária auto-incremento |
| `contactId` | INTEGER | - | ✅ | ID único do contato (ÚNICO) |
| `name` | VARCHAR | 100 | ✅ | Nome completo do contato |
| `phone` | VARCHAR | 20 | ✅ | Número de telefone |
| `email` | VARCHAR | 150 | ❌ | E-mail do contato |
| `isActive` | BOOLEAN | - | ✅ | Contato ativo (padrão: true) |
| `createdAt` | TIMESTAMP | - | ✅ | Data de criação |
| `updatedAt` | TIMESTAMP | - | ✅ | Data da última atualização |

#### 🔍 Índices:
- **Primary Key**: `id`
- **Unique Index**: `contactId`
- **Index**: `phone`

---

## 🎮 Estados da Conversa (currentStep)

### Estados Principais:
- `welcome` - Mensagem inicial com menu
- `ask_name_option1` - Solicita nome (opção 1)
- `confirm_name_option1` - Confirma nome (opção 1)
- `request_project_option1` - Solicita projeto (opção 1)
- `transfer_to_human_option1` - Transfere para humano (opção 1)
- `store_address` - Endereço da loja
- `payment_info` - Informações de pagamento
- `option2_flow` - Fluxo opção 2
- `option3_flow` - Fluxo opção 3

---

## 🔧 Configuração de Produção (Railway)

### Variáveis de Ambiente:
```bash
NODE_ENV=production
DATABASE_HOST=postgres.railway.internal
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=RdpmtkgDGbpDvvFJgnUkoEKCxIewremX
DATABASE_NAME=railway
```

### Script SQL para Criação das Tabelas:

```sql
-- Criar tabela de contatos
CREATE TABLE tb_contact (
    id SERIAL PRIMARY KEY,
    "contactId" INTEGER UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de conversas
CREATE TABLE tb_conversation (
    id SERIAL PRIMARY KEY,
    "contactId" INTEGER UNIQUE NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "contactName" VARCHAR(100) NOT NULL,
    "contactPhone" VARCHAR(20) NOT NULL,
    "currentStep" VARCHAR(50) DEFAULT 'welcome',
    "stepData" JSON,
    "lastMessage" VARCHAR(200),
    "isActive" BOOLEAN DEFAULT true,
    "transferredToHuman" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para performance
CREATE INDEX idx_contact_phone ON tb_contact(phone);
CREATE INDEX idx_conversation_ticket ON tb_conversation("ticketId");
CREATE INDEX idx_conversation_step ON tb_conversation("currentStep");
CREATE INDEX idx_conversation_active ON tb_conversation("isActive");

-- Criar trigger para atualizar updatedAt automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tb_contact_updated_at 
    BEFORE UPDATE ON tb_contact 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tb_conversation_updated_at 
    BEFORE UPDATE ON tb_conversation 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 📊 Exemplo de Dados

### tb_contact:
```json
{
  "id": 1,
  "contactId": 24914,
  "name": "João Silva",
  "phone": "5511999999999",
  "email": "joao@email.com",
  "isActive": true,
  "createdAt": "2025-08-02T11:40:58.000Z",
  "updatedAt": "2025-08-02T11:40:58.000Z"
}
```

### tb_conversation:
```json
{
  "id": 1,
  "contactId": 24914,
  "ticketId": 12345,
  "contactName": "João Silva",
  "contactPhone": "5511999999999",
  "currentStep": "request_project_option1",
  "stepData": {
    "userName": "João Silva",
    "selectedOption": "1",
    "confirmedName": true
  },
  "lastMessage": "João Silva",
  "isActive": true,
  "transferredToHuman": false,
  "createdAt": "2025-08-02T11:40:58.000Z",
  "updatedAt": "2025-08-02T12:15:30.000Z"
}
```

---

## 🚀 Deploy no Railway

1. **Conecte seu repositório** ao Railway
2. **Configure as variáveis de ambiente** no painel do Railway
3. **Execute o script SQL** no console do PostgreSQL do Railway
4. **Deploy automático** será executado

### Comando para conectar ao banco no Railway:
```bash
# Via Railway CLI
railway login
railway connect
railway run npm run start:prod
```

---

## 📈 Monitoramento

### Queries Úteis para Monitoramento:

```sql
-- Conversas ativas
SELECT COUNT(*) FROM tb_conversation WHERE "isActive" = true;

-- Conversas por etapa
SELECT "currentStep", COUNT(*) 
FROM tb_conversation 
WHERE "isActive" = true 
GROUP BY "currentStep";

-- Transferências para humano hoje
SELECT COUNT(*) 
FROM tb_conversation 
WHERE "transferredToHuman" = true 
AND DATE("updatedAt") = CURRENT_DATE;

-- Contatos únicos hoje
SELECT COUNT(DISTINCT "contactId") 
FROM tb_conversation 
WHERE DATE("createdAt") = CURRENT_DATE;
```

---

## 🔐 Backup e Segurança

- **Backups automáticos** do Railway (diários)
- **SSL/TLS** ativado por padrão
- **Variáveis de ambiente** protegidas
- **Logs** disponíveis no painel do Railway

---

*Última atualização: 02/08/2025 - Sistema pronto para produção! 🚀*
