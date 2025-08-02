# 🚀 Deploy no Railway - Chatbot Vera D'Or

## 📋 Passo a Passo para Deploy

### 1. **Preparar o Repositório**
```bash
git add .
git commit -m "feat: configuração para produção Railway"
git push origin master
```

### 2. **Configurar no Railway**

1. Acesse [railway.app](https://railway.app)
2. Conecte seu repositório GitHub `vera-dor`
3. Crie um novo projeto
4. Adicione o serviço PostgreSQL

### 3. **Configurar Variáveis de Ambiente**

No painel do Railway, adicione estas variáveis:

```env
NODE_ENV=production
DATABASE_HOST=postgres.railway.internal
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=RdpmtkgDGbpDvvFJgnUkoEKCxIewremX
DATABASE_NAME=railway
PORT=3000
```

### 4. **Executar Script SQL**

1. Abra o console do PostgreSQL no Railway
2. Execute o conteúdo do arquivo `railway-setup.sql`
3. Verifique se as tabelas foram criadas

### 5. **Deploy Automático**

O Railway irá automaticamente:
- Instalar dependências (`npm install`)
- Compilar o projeto (`npm run build`)
- Iniciar a aplicação (`npm run start:prod`)

### 6. **Verificar Funcionamento**

Endpoints disponíveis:
- `GET /` - Status da aplicação
- `POST /webhook` - Receber webhooks
- `GET /messages` - Listar mensagens
- `POST /messages/send/:ticketId` - Enviar mensagens

### 7. **Configurar Webhook**

Configure o webhook do seu sistema para apontar para:
```
https://seu-app.railway.app/webhook
```

---

## 🔧 Comandos Úteis

### Railway CLI:
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conectar ao projeto
railway link

# Ver logs
railway logs

# Executar comandos
railway run npm run start:prod

# Conectar ao banco
railway connect postgres
```

### Verificar Deploy:
```bash
# Ver status
curl https://seu-app.railway.app/

# Testar webhook
curl -X POST https://seu-app.railway.app/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": 24914,
    "message": "1",
    "ticketId": 12345
  }'
```

---

## 📊 Monitoramento

### Logs do Railway:
- Acesse o painel do Railway
- Vá na aba "Deployments"
- Clique em "View Logs"

### Consultas no Banco:
```sql
-- Ver conversas ativas
SELECT * FROM tb_conversation WHERE "isActive" = true;

-- Ver contatos cadastrados
SELECT * FROM tb_contact ORDER BY "createdAt" DESC LIMIT 10;

-- Ver estatísticas
SELECT "currentStep", COUNT(*) as total
FROM tb_conversation 
GROUP BY "currentStep";
```

---

## 🔄 Atualizações

Para atualizar o sistema:
1. Faça as alterações no código
2. Commit e push para o GitHub
3. O Railway fará deploy automático

---

## 🆘 Troubleshooting

### Problemas Comuns:

**1. Erro de conexão com banco:**
- Verifique as variáveis de ambiente
- Confirme que o PostgreSQL está ativo

**2. Aplicação não inicia:**
- Verifique os logs no Railway
- Confirme que as dependências foram instaladas

**3. Webhook não funciona:**
- Verifique a URL do webhook
- Confirme que o endpoint está acessível

### Contatos de Suporte:
- GitHub: `moisesoliveira-dev`
- Sistema: Vera D'Or Chatbot

---

*Deploy configurado para Railway - Pronto para produção! 🚀*
