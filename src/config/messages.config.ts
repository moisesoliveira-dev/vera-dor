export const messagesConfig = {
    // API para envio de mensagens
    api: {
        baseUrl: 'https://cmmodulados.gosac.com.br/api/messages',
        authorization: 'INTEGRATION 1f7e1c970adf60b4ac6dc56afbc4edcd3ed52de8656fb38f7e899bff6889'
    },

    // Contato ID para teste (somente processar este contato durante desenvolvimento)
    testContactId: 24914,

    // Fluxo de conversação do chatbot
    conversationFlow: {
        welcome: {
            id: 'welcome',
            title: 'Mensagem de Boas-vindas',
            message: `Olá! Seja bem-vindo à Cinthia Moreira Modulados 👋
Sou a Vera D'Or, sua atendente virtual 🤖✨
Como posso te ajudar hoje?

*1* - 📐 Já tenho o projeto e quero orçar.
*2* - 📏 Só tenho a planta baixa e quero um projeto.
*3* - 🚫 Não tenho nem o projeto e nem a planta baixa.
*4* - 💳 Quero informações sobre forma de pagamento por boleto bancário.
*5* - 📍 Qual endereço da loja física?

👉 Envie o número da opção desejada.`,
            validOptions: ['1', '2', '3', '4', '5'],
            nextStep: {
                '1': 'ask_name_option1',
                '2': 'confirm_name_option1',
                '3': 'request_project_option1',
                '4': 'transfer_to_human_option1',
                '5': 'store_address'
            }
        },

        ask_name_option1: {
            id: 'ask_name_option1',
            title: 'Solicitar Nome - Opção 1',
            message: `Antes de prosseguirmos, você pode me informar seu nome, por gentileza? 😊

*0* - ↩️ Voltar uma etapa
*10* - 🔄 Recomeçar o atendimento`,
            validOptions: ['0', '10'],
            expectsText: true, // Espera texto livre (nome)
            nextStep: 'confirm_name_option1',
            specialActions: {
                '0': 'welcome',
                '10': 'welcome'
            }
        },

        confirm_name_option1: {
            id: 'confirm_name_option1',
            title: 'Confirmar Nome - Opção 1',
            message: `Só confirmando, seu nome é [nome], certo? 😊

*1* - Sim
*2* - Não

*10* - 🔄 Recomeçar o atendimento

� Envie o número da opção desejada.`,
            validOptions: ['1', '2', '10'],
            nextStep: {
                '1': 'request_project_option1',
                '2': 'ask_name_option1',
                '10': 'welcome'
            }
        },

        request_project_option1: {
            id: 'request_project_option1',
            title: 'Solicitar Projeto - Opção 1',
            message: `📎 Pode enviar o projeto aqui mesmo.
Pode ser em PDF, imagem ou qualquer outro formato que você tiver.

👋🛠 Assim que recebermos, um atendente humano vai te chamar por aqui para dar sequência na criação do seu projeto. ✨

Estamos animados para te ajudar a transformar seu ambiente! 🏡

*0* - ↩️ Voltar uma etapa
*10* - 🔄 Recomeçar o atendimento`,
            validOptions: ['0', '10'],
            expectsFile: true, // Espera arquivo
            nextStep: 'transfer_to_human_option1',
            specialActions: {
                '0': 'confirm_name_option1',
                '10': 'welcome'
            }
        },

        transfer_to_human_option1: {
            id: 'transfer_to_human_option1',
            title: 'Transferir para Humano - Opção 1',
            message: `✅ Tudo certo por aqui!
Agora vou te encaminhar para o nosso time de Projetistas 💼, que vai continuar te atendendo com toda atenção e carinho. 💖

Aguarde só um instante, [nome]… já estou lhe redirecionando! �`,
            isTransferStep: true,
            isEndStep: true
        },

        // Placeholders para outras opções (implementar depois)
        option2_flow: {
            id: 'option2_flow',
            title: 'Opção 2 - Em desenvolvimento',
            message: `Esta opção ainda está em desenvolvimento.

*0* - ↩️ Voltar uma etapa
*10* - 🔄 Recomeçar o atendimento`,
            validOptions: ['0', '10'],
            nextStep: {
                '0': 'welcome',
                '10': 'welcome'
            }
        },

        option3_flow: {
            id: 'option3_flow',
            title: 'Opção 3 - Em desenvolvimento',
            message: `Esta opção ainda está em desenvolvimento.

*0* - ↩️ Voltar uma etapa
*10* - 🔄 Recomeçar o atendimento`,
            validOptions: ['0', '10'],
            nextStep: {
                '0': 'welcome',
                '10': 'welcome'
            }
        },

        payment_info: {
            id: 'payment_info',
            title: 'Informações de Pagamento',
            message: `Esta opção ainda está em desenvolvimento.

*0* - ↩️ Voltar uma etapa
*10* - 🔄 Recomeçar o atendimento`,
            validOptions: ['0', '10'],
            nextStep: {
                '0': 'welcome',
                '10': 'welcome'
            }
        },

        store_address: {
            id: 'store_address',
            title: 'Endereço da Loja',
            message: `Esta opção ainda está em desenvolvimento.

*0* - ↩️ Voltar uma etapa
*10* - 🔄 Recomeçar o atendimento`,
            validOptions: ['0', '10'],
            nextStep: {
                '0': 'welcome',
                '10': 'welcome'
            }
        }
    },

    // Mensagens de erro e sistema
    systemMessages: {
        invalidOption: {
            message: `❌ Opção inválida. Por favor, escolha uma das opções disponíveis.

*10* - 🔄 Recomeçar o atendimento`
        },

        error: {
            message: `😔 Ops! Parece que houve um problema técnico. 

Por favor, tente novamente em alguns instantes ou entre em contato conosco através do telefone **(92) 94551-471**.

*10* - 🔄 Recomeçar o atendimento

Pedimos desculpas pelo inconveniente! 🙏`
        }
    }
};
