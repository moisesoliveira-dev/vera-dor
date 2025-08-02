# Mapeamento dos Dados do Webhook

Este documento descreve todos os dados que são recebidos no webhook e como eles são mapeados no sistema.

## Estrutura Principal

O webhook recebe dados na seguinte estrutura:
```json
{
  "data": {
    // Dados da mensagem
  },
  "type": "messages:created"
}
```

## Dados da Mensagem (data)

### Informações Básicas da Mensagem
- `messageId`: ID único da mensagem
- `body`: Conteúdo/texto da mensagem
- `mediaType`: Tipo de mídia ("chat", "image", "video", etc.)
- `mediaUrl`: URL da mídia (se houver)
- `mediaPath`: Caminho local da mídia (se houver)
- `ack`: Status de confirmação (1 = enviado, 2 = entregue, 3 = lido)
- `read`: Se a mensagem foi lida
- `fromMe`: Se a mensagem foi enviada pelo bot/sistema
- `sent`: Se a mensagem foi enviada com sucesso
- `isDeleted`: Se a mensagem foi deletada
- `isForwarded`: Se a mensagem foi encaminhada
- `downloaded`: Se a mídia foi baixada
- `createdAt`: Data/hora de criação
- `updatedAt`: Data/hora da última atualização

### Relacionamentos
- `ticketId`: ID do ticket/conversa
- `contactId`: ID do contato
- `groupContactId`: ID do contato no grupo
- `connectionId`: ID da conexão
- `queueId`: ID da fila (se houver)
- `templateId`: ID do template (se for mensagem template)
- `quotedMsgId`: ID da mensagem sendo respondida
- `vcardContactId`: ID do contato vCard (se for compartilhamento de contato)
- `senderUserId`: ID do usuário remetente
- `destinationUserId`: ID do usuário destinatário

### Metadados
- `kind`: Tipo/categoria da mensagem
- `fromGroup`: Se a mensagem veio de um grupo
- `transmissionId`: ID de transmissão
- `imageId`: ID da imagem (se houver)
- `errorMessage`: Mensagem de erro (se houver)

## Dados do Contato

### Informações Pessoais
- `id`: ID único do contato
- `name`: Nome do contato
- `number`: Número de telefone/WhatsApp
- `email`: Email do contato
- `profilePicUrl`: URL da foto de perfil
- `document`: Documento (CPF, etc.)
- `cpf`: CPF específico
- `company`: Empresa
- `cnpj`: CNPJ da empresa

### Configurações e Status
- `isGroup`: Se é um grupo
- `hasWhatsapp`: Se tem WhatsApp
- `hasTelegram`: Se tem Telegram
- `imported`: Se foi importado
- `favorite`: Se é favorito
- `blacklist`: Se está na lista negra

### Redes Sociais e Contatos
- `instagram`: Instagram
- `linkedIn`: LinkedIn
- `telegramId`: ID do Telegram
- `telegramUsername`: Username do Telegram

### Configurações do Sistema
- `defaultUserId`: ID do usuário padrão
- `defaultQueueId`: ID da fila padrão
- `whatsAppId`: ID específico do WhatsApp
- `kind`: Tipo de contato ("whatsapp", "telegram", etc.)

### Dados Comerciais
- `contract`: Contrato
- `value`: Valor
- `validity`: Validade
- `observation`: Observações

### Timestamps
- `createdAt`: Data de criação
- `updatedAt`: Data da última atualização

## Dados do Ticket/Conversa

### Informações Básicas
- `id`: ID único do ticket
- `status`: Status do ticket ("pending", "open", "closed", etc.)
- `protocol`: Protocolo único do ticket
- `lastMessage`: Última mensagem
- `lastAction`: Última ação realizada
- `origin`: Origem da conversa ("whatsapp", "telegram", etc.)

### Contadores e Status
- `unreadMessages`: Mensagens não lidas
- `unreadMessages2`: Contador adicional de mensagens não lidas
- `statusBot`: Status do bot (0 = inativo, 1 = ativo)
- `syncTotal`: Total de sincronização
- `onMenu`: Status do menu
- `onMenuId`: ID do menu atual

### Relacionamentos
- `contactId`: ID do contato
- `whatsappId`: ID da conexão WhatsApp
- `userId`: ID do usuário atendente
- `queueId`: ID da fila
- `departmentId`: ID do departamento
- `destinationUserId`: ID do usuário de destino

### Configurações
- `isGroup`: Se é um grupo
- `window`: Janela de atendimento
- `imported`: Se foi importado
- `transmissionId`: ID de transmissão
- `kind`: Tipo do ticket

### NPS e Avaliação
- `npsValue`: Valor do NPS
- `closureObservation`: Observação de fechamento

### Timestamps
- `createdAt`: Data de criação
- `updatedAt`: Data da última atualização
- `lastMessageAt`: Data da última mensagem
- `closedAt`: Data de fechamento

### URLs e Origem
- `sourceUrl`: URL de origem

## Dados da Conexão WhatsApp

### Informações da Conexão
- `id`: ID da conexão
- `name`: Nome da conexão
- `session`: Sessão ativa
- `qrcode`: Código QR para conexão
- `status`: Status da conexão ("CONNECTED", "DISCONNECTED", etc.)
- `type`: Tipo da conexão ("whatsapp", etc.)
- `phoneNumber`: Número do telefone conectado

### Status do Dispositivo
- `battery`: Nível da bateria
- `plugged`: Se está carregando
- `enabled`: Se está habilitado

### Configurações de Horário
- `startTime`: Horário de início
- `finishTime`: Horário de fim
- `mon`, `tue`, `wed`, `thu`, `fri`, `sat`: Dias da semana ativos
- `openingHoursId`: ID do horário de funcionamento

### Mensagens Automáticas
- `greetingMessage`: Mensagem de saudação
- `closeMessage`: Mensagem de fechamento
- `outTimeMessage`: Mensagem fora do horário
- `contingencyMessage`: Mensagem de contingência
- `endContingencyMessage`: Mensagem de fim de contingência
- `greetingArchive`: Arquivo de saudação

### Configurações Avançadas
- `defaultQueueId`: Fila padrão
- `retries`: Tentativas de reconexão
- `isDefault`: Se é a conexão padrão
- `sum`: Configuração de soma
- `syncPercent`: Porcentagem de sincronização
- `settedWebHook`: Se o webhook foi configurado
- `enableZeroMenu`: Se o menu zero está habilitado

### APIs e Integrações
- `apiId`: ID da API
- `apiHash`: Hash da API
- `secretCode`: Código secreto
- `password`: Senha
- `username`: Username
- `apiKey`: Chave da API
- `voipToken`: Token VoIP
- `pageId`: ID da página
- `provider`: Provedor

### Restrições e Limites
- `accountRestriction`: Restrições da conta
- `accountViolationCount`: Contagem de violações
- `messagingLimit`: Limite de mensagens

### NPS
- `npsEnabled`: Se NPS está habilitado
- `npsMessage`: Mensagem do NPS

### Configurações de Email (se aplicável)
- `host`: Host do servidor
- `port`: Porta do servidor
- `tls`: Se usa TLS

### Timestamps
- `createdAt`: Data de criação
- `updatedAt`: Data da última atualização
- `deletedAt`: Data de exclusão (se excluído)
- `startedAt`: Data de início da conexão
- `syncAt`: Data da última sincronização
- `qrCreatedAt`: Data de criação do QR Code
- `resetAt`: Data do último reset

## Como Usar os Dados Mapeados

O serviço `ChatbotService` extrai automaticamente as informações mais relevantes e as organiza em categorias:

1. **message**: Dados específicos da mensagem
2. **contact**: Informações do contato
3. **ticket**: Dados da conversa/atendimento
4. **whatsapp**: Informações da conexão

Essa estrutura facilita o desenvolvimento de funcionalidades do chatbot como:
- Identificação de usuários
- Histórico de conversas
- Roteamento por filas
- Mensagens automáticas
- Integração com CRM
- Relatórios e analytics
