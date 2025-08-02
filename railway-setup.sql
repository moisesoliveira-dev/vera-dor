-- Script SQL para Railway PostgreSQL
-- Execute este script no console do banco do Railway

-- Criar tabela de contatos
CREATE TABLE IF NOT EXISTS tb_contact (
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
CREATE TABLE IF NOT EXISTS tb_conversation (
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
CREATE INDEX IF NOT EXISTS idx_contact_phone ON tb_contact(phone);
CREATE INDEX IF NOT EXISTS idx_conversation_ticket ON tb_conversation("ticketId");
CREATE INDEX IF NOT EXISTS idx_conversation_step ON tb_conversation("currentStep");
CREATE INDEX IF NOT EXISTS idx_conversation_active ON tb_conversation("isActive");
CREATE INDEX IF NOT EXISTS idx_conversation_contact ON tb_conversation("contactId");

-- Criar função para atualizar updatedAt automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Criar triggers para atualizar updatedAt automaticamente
DROP TRIGGER IF EXISTS update_tb_contact_updated_at ON tb_contact;
CREATE TRIGGER update_tb_contact_updated_at 
    BEFORE UPDATE ON tb_contact 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tb_conversation_updated_at ON tb_conversation;
CREATE TRIGGER update_tb_conversation_updated_at 
    BEFORE UPDATE ON tb_conversation 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de teste (opcional)
INSERT INTO tb_contact ("contactId", name, phone, email) 
VALUES (24914, 'Teste Vera D''Or', '5592000000000', 'teste@verador.com')
ON CONFLICT ("contactId") DO NOTHING;

-- Verificar se as tabelas foram criadas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('tb_contact', 'tb_conversation')
ORDER BY table_name, ordinal_position;

-- Contar registros
SELECT 
    'tb_contact' as tabela, 
    COUNT(*) as total_registros 
FROM tb_contact
UNION ALL
SELECT 
    'tb_conversation' as tabela, 
    COUNT(*) as total_registros 
FROM tb_conversation;
