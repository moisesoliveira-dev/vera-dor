import { Injectable } from '@nestjs/common';

interface PendingMessage {
    contactId: number;
    message: any;
    timestamp: number;
    timeoutId: NodeJS.Timeout;
}

@Injectable()
export class DebounceService {
    private pendingMessages = new Map<number, PendingMessage>();
    private readonly DEBOUNCE_TIME = 3000; // 3 segundos

    /**
     * Aplica debounce nas mensagens recebidas
     * @param contactId ID do contato
     * @param message Dados da mensagem
     * @param callback Função a ser executada após o debounce
     */
    debounceMessage(
        contactId: number,
        message: any,
        callback: (message: any) => void
    ): void {
        // Cancelar timer anterior se existir
        const existing = this.pendingMessages.get(contactId);
        if (existing) {
            clearTimeout(existing.timeoutId);
        }

        // Criar novo timer
        const timeoutId = setTimeout(() => {
            this.pendingMessages.delete(contactId);
            callback(message);
        }, this.DEBOUNCE_TIME);

        // Armazenar mensagem pendente
        this.pendingMessages.set(contactId, {
            contactId,
            message,
            timestamp: Date.now(),
            timeoutId
        });

        console.log(`⏱️ Debounce aplicado para contactId ${contactId} - aguardando ${this.DEBOUNCE_TIME}ms`);
    }

    /**
     * Cancela debounce pendente para um contato
     * @param contactId ID do contato
     */
    cancelDebounce(contactId: number): void {
        const existing = this.pendingMessages.get(contactId);
        if (existing) {
            clearTimeout(existing.timeoutId);
            this.pendingMessages.delete(contactId);
            console.log(`❌ Debounce cancelado para contactId ${contactId}`);
        }
    }

    /**
     * Verifica se há debounce pendente para um contato
     * @param contactId ID do contato
     */
    hasPendingDebounce(contactId: number): boolean {
        return this.pendingMessages.has(contactId);
    }

    /**
     * Limpa todos os debounces pendentes
     */
    clearAllDebounces(): void {
        this.pendingMessages.forEach((pending) => {
            clearTimeout(pending.timeoutId);
        });
        this.pendingMessages.clear();
        console.log('🧹 Todos os debounces foram limpos');
    }
}
