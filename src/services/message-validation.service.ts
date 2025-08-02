import { Injectable } from '@nestjs/common';

export interface MessageValidationResult {
    isValid: boolean;
    messageType: 'chat' | 'media' | 'other';
    shouldRespond: boolean;
    warningCount: number;
}

@Injectable()
export class MessageValidationService {
    private nameValidationAttempts = new Map<number, number>();
    private optionValidationAttempts = new Map<number, number>();
    private readonly MAX_WARNINGS = 1; // Apenas 1 aviso por tipo

    /**
     * Valida se a mensagem é do tipo chat (texto)
     * @param webhookData Dados do webhook
     */
    validateMessageType(webhookData: any): MessageValidationResult {
        const contactId = webhookData.contactId;
        const mediaType = webhookData.data?.mediaType || 'unknown';

        let messageType: 'chat' | 'media' | 'other';

        if (mediaType === 'chat') {
            messageType = 'chat';
        } else if (['image', 'document', 'audio', 'video'].includes(mediaType)) {
            messageType = 'media';
        } else {
            messageType = 'other';
        }

        return {
            isValid: messageType === 'chat',
            messageType,
            shouldRespond: true,
            warningCount: 0
        };
    }

    /**
     * Valida entrada de nome (deve ser tipo chat)
     * @param webhookData Dados do webhook
     */
    validateNameInput(webhookData: any): MessageValidationResult {
        const contactId = webhookData.contactId;
        const mediaType = webhookData.data?.mediaType || 'unknown';

        const result = this.validateMessageType(webhookData);

        if (!result.isValid) {
            // Incrementar contador de tentativas inválidas
            const currentAttempts = this.nameValidationAttempts.get(contactId) || 0;
            const newAttempts = currentAttempts + 1;
            this.nameValidationAttempts.set(contactId, newAttempts);

            // Só responder se for a primeira tentativa inválida
            result.shouldRespond = newAttempts <= this.MAX_WARNINGS;
            result.warningCount = newAttempts;

            console.log(`⚠️ ContactId ${contactId} - Tentativa inválida de nome ${newAttempts}/${this.MAX_WARNINGS} (tipo: ${mediaType})`);
        } else {
            // Resetar contador se enviou tipo correto
            this.nameValidationAttempts.delete(contactId);
            result.shouldRespond = true;
            result.warningCount = 0;
        }

        return result;
    }

    /**
     * Valida seleção de opção (1 ou 2 para confirmação)
     * @param webhookData Dados do webhook
     * @param validOptions Opções válidas
     */
    validateOptionInput(webhookData: any, validOptions: string[]): MessageValidationResult {
        const contactId = webhookData.contactId;
        const message = webhookData.data?.message?.text || '';
        const mediaType = webhookData.data?.mediaType || 'unknown';

        const typeResult = this.validateMessageType(webhookData);

        if (!typeResult.isValid) {
            // Não é texto, ignorar silenciosamente
            return {
                isValid: false,
                messageType: typeResult.messageType,
                shouldRespond: false,
                warningCount: 0
            };
        }

        const isValidOption = validOptions.includes(message.trim());

        if (!isValidOption) {
            // Incrementar contador de tentativas inválidas
            const currentAttempts = this.optionValidationAttempts.get(contactId) || 0;
            const newAttempts = currentAttempts + 1;
            this.optionValidationAttempts.set(contactId, newAttempts);

            // Só responder se for a primeira tentativa inválida
            const shouldRespond = newAttempts <= this.MAX_WARNINGS;

            console.log(`⚠️ ContactId ${contactId} - Opção inválida "${message}" - Tentativa ${newAttempts}/${this.MAX_WARNINGS}`);

            return {
                isValid: false,
                messageType: typeResult.messageType,
                shouldRespond,
                warningCount: newAttempts
            };
        } else {
            // Resetar contador se enviou opção correta
            this.optionValidationAttempts.delete(contactId);
            return {
                isValid: true,
                messageType: typeResult.messageType,
                shouldRespond: true,
                warningCount: 0
            };
        }
    }

    /**
     * Gera mensagem de erro para nome inválido
     */
    getNameValidationErrorMessage(): string {
        return `❌ Por favor, envie apenas seu nome em texto. 

Não é possível processar arquivos, imagens ou outros tipos de mídia nesta etapa.

Digite apenas seu nome para continuar. 😊`;
    }

    /**
     * Gera mensagem de erro para opção inválida
     */
    getOptionValidationErrorMessage(validOptions: string[]): string {
        const optionsText = validOptions.map(opt => `*${opt}*`).join(' ou ');

        return `❌ Opção inválida. 

Por favor, escolha apenas ${optionsText}.

Envie o número da opção desejada. 😊`;
    }

    /**
     * Limpa contadores de tentativas para um contato
     * @param contactId ID do contato
     */
    clearValidationAttempts(contactId: number): void {
        this.nameValidationAttempts.delete(contactId);
        this.optionValidationAttempts.delete(contactId);
        console.log(`🧹 Contadores de validação limpos para contactId ${contactId}`);
    }

    /**
     * Limpa todos os contadores de tentativas
     */
    clearAllValidationAttempts(): void {
        this.nameValidationAttempts.clear();
        this.optionValidationAttempts.clear();
        console.log('🧹 Todos os contadores de validação foram limpos');
    }
}
