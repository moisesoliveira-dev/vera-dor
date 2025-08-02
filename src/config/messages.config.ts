export const messagesConfig = {
    // API para envio de mensagens
    api: {
        baseUrl: 'https://cmmodulados.gosac.com.br/api/messages',
        authorization: 'INTEGRATION 1f7e1c970adf60b4ac6dc56afbc4edcd3ed52de8656fb38f7e899bff6889'
    },

    // Contato ID para teste (somente processar este contato durante desenvolvimento)
    testContactId: 24914,

    // Mensagens do sistema (fácil de visualizar e alterar)
    templates: {
        welcome: {
            id: 'welcome',
            title: 'Mensagem de Boas-vindas',
            message: `🌟 Olá! Seja muito bem-vindo(a) à *Cinthia Moreira Modulados*! 

Eu sou a *Vera*, sua assistente virtual, e estou aqui para te ajudar a transformar seus sonhos em realidade! ✨

🏠 *Somos especialistas em:*
• Cozinhas planejadas
• Dormitórios
• Banheiros
• Escritórios
• Áreas de lazer
• E muito mais!

💬 *Como posso te ajudar hoje?*
• Orçamento personalizado
• Tirar dúvidas sobre nossos produtos
• Agendar uma visita técnica
• Conhecer nossos projetos

🕒 *Horário de atendimento:*
Segunda a Sexta: 08h às 17h
Sábados: 08h às 12h

Digite sua mensagem que logo um de nossos especialistas irá te atender! 😊`
        },

        outsideHours: {
            id: 'outsideHours',
            title: 'Mensagem Fora do Horário',
            message: `😊 Olá! Como vai? Me chamo Katherinne. E você? 

Que bom te receber à *Cinthia Moreira Modulados*! 

🕒 Nosso horário de funcionamento é:
• *Segunda à Sexta:* das 08h às 17h
• *Sábados:* das 08h às 12h

Deixe sua mensagem que nós retornaremos em breve! E desde já, obrigada por sua paciência 🤗.`
        },

        error: {
            id: 'error',
            title: 'Mensagem de Erro',
            message: `😔 Ops! Parece que houve um problema técnico. 

Por favor, tente novamente em alguns instantes ou entre em contato conosco através do telefone **(92) 94551-471**.

Pedimos desculpas pelo inconveniente! 🙏`
        }
    }
};
