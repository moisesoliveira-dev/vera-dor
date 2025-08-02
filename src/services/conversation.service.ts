import { Injectable, Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { isDevelopment } from '../config/database.config';

@Injectable()
export class ConversationService {
    private readonly logger = new Logger(ConversationService.name);
    private mockConversations: Map<number, Conversation> = new Map(); // Para desenvolvimento sem banco

    constructor(
        @Optional()
        @InjectRepository(Conversation)
        private conversationRepository?: Repository<Conversation>,
    ) { }

    /**
     * Busca uma conversa ativa pelo contactId
     */
    async findActiveByContactId(contactId: number): Promise<Conversation | null> {
        try {
            this.logger.log(`Buscando conversa ativa para contactId: ${contactId}`);

            if (isDevelopment && !this.conversationRepository) {
                // Modo desenvolvimento sem banco
                const conversation = this.mockConversations.get(contactId) || null;
                if (conversation && conversation.isActive) {
                    this.logger.log(`[MOCK] Conversa ativa encontrada: Step ${conversation.currentStep}`);
                    return conversation;
                }
                this.logger.log(`[MOCK] Nenhuma conversa ativa encontrada para contactId: ${contactId}`);
                return null;
            }

            if (!this.conversationRepository) {
                throw new Error('Repository não disponível');
            }

            const conversation = await this.conversationRepository.findOne({
                where: {
                    contactId: contactId,
                    isActive: true
                }
            });

            if (conversation) {
                this.logger.log(`Conversa ativa encontrada: Step ${conversation.currentStep}`);
                return conversation;
            } else {
                this.logger.log(`Nenhuma conversa ativa encontrada para contactId: ${contactId}`);
                return null;
            }
        } catch (error) {
            this.logger.error(`Erro ao buscar conversa para contactId ${contactId}:`, error);
            throw error;
        }
    }

    /**
     * Cria uma nova conversa
     */
    async createConversation(data: {
        contactId: number;
        ticketId: number;
        contactName: string;
        contactPhone: string;
        currentStep?: string;
    }): Promise<Conversation> {
        try {
            this.logger.log(`Criando nova conversa para contactId: ${data.contactId}`);

            const conversationData = {
                ...data,
                currentStep: data.currentStep || 'welcome',
                stepData: {},
                isActive: true,
                transferredToHuman: false
            };

            if (isDevelopment && !this.conversationRepository) {
                // Modo desenvolvimento sem banco
                const mockConversation: Conversation = {
                    id: Date.now(), // ID mock
                    ...conversationData,
                    createdAt: new Date(),
                    updatedAt: new Date()
                } as Conversation;

                this.mockConversations.set(data.contactId, mockConversation);
                this.logger.log(`[MOCK] Conversa criada com sucesso: ID ${mockConversation.id}`);
                return mockConversation;
            }

            if (!this.conversationRepository) {
                throw new Error('Repository não disponível');
            }

            const conversation = this.conversationRepository.create(conversationData);
            const savedConversation = await this.conversationRepository.save(conversation);

            this.logger.log(`Conversa criada com sucesso: ID ${savedConversation.id}`);
            return savedConversation;
        } catch (error) {
            this.logger.error('Erro ao criar conversa:', error);
            throw error;
        }
    }

    /**
     * Atualiza o passo atual da conversa
     */
    async updateConversationStep(
        contactId: number,
        newStep: string,
        stepData?: any,
        lastMessage?: string
    ): Promise<void> {
        try {
            this.logger.log(`Atualizando conversa ${contactId} para step: ${newStep}`);

            if (isDevelopment && !this.conversationRepository) {
                // Modo desenvolvimento sem banco
                const conversation = this.mockConversations.get(contactId);
                if (conversation) {
                    conversation.currentStep = newStep;
                    conversation.stepData = stepData || conversation.stepData;
                    conversation.lastMessage = lastMessage || conversation.lastMessage;
                    conversation.updatedAt = new Date();
                    this.mockConversations.set(contactId, conversation);
                    this.logger.log(`[MOCK] Conversa atualizada para step: ${newStep}`);
                }
                return;
            }

            if (!this.conversationRepository) {
                throw new Error('Repository não disponível');
            }

            const updateData: any = {
                currentStep: newStep,
                updatedAt: new Date()
            };

            if (stepData !== undefined) {
                updateData.stepData = stepData;
            }

            if (lastMessage !== undefined) {
                updateData.lastMessage = lastMessage;
            }

            await this.conversationRepository.update(
                { contactId: contactId, isActive: true },
                updateData
            );

            this.logger.log(`Conversa atualizada para step: ${newStep}`);
        } catch (error) {
            this.logger.error(`Erro ao atualizar conversa ${contactId}:`, error);
            throw error;
        }
    }

    /**
     * Finaliza uma conversa (transfere para humano)
     */
    async finalizeConversation(contactId: number): Promise<void> {
        try {
            this.logger.log(`Finalizando conversa para contactId: ${contactId}`);

            if (isDevelopment && !this.conversationRepository) {
                // Modo desenvolvimento sem banco
                const conversation = this.mockConversations.get(contactId);
                if (conversation) {
                    conversation.isActive = false;
                    conversation.transferredToHuman = true;
                    conversation.updatedAt = new Date();
                    this.mockConversations.set(contactId, conversation);
                    this.logger.log(`[MOCK] Conversa finalizada e transferida para humano`);
                }
                return;
            }

            if (!this.conversationRepository) {
                throw new Error('Repository não disponível');
            }

            await this.conversationRepository.update(
                { contactId: contactId, isActive: true },
                {
                    isActive: false,
                    transferredToHuman: true,
                    updatedAt: new Date()
                }
            );

            this.logger.log(`Conversa finalizada e transferida para humano`);
        } catch (error) {
            this.logger.error(`Erro ao finalizar conversa ${contactId}:`, error);
            throw error;
        }
    }

    /**
     * Reinicia uma conversa (volta para o início)
     */
    async restartConversation(contactId: number): Promise<void> {
        try {
            this.logger.log(`Reiniciando conversa para contactId: ${contactId}`);

            await this.updateConversationStep(contactId, 'welcome', {});
        } catch (error) {
            this.logger.error(`Erro ao reiniciar conversa ${contactId}:`, error);
            throw error;
        }
    }
}
