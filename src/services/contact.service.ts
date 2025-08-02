import { Injectable, Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { isDevelopment } from '../config/database.config';

@Injectable()
export class ContactService {
    private readonly logger = new Logger(ContactService.name);
    private mockContacts: Map<number, Contact> = new Map(); // Para desenvolvimento sem banco

    constructor(
        @Optional()
        @InjectRepository(Contact)
        private contactRepository?: Repository<Contact>,
    ) { }

    /**
     * Busca um contato pelo contactId
     */
    async findByContactId(contactId: number): Promise<Contact | null> {
        try {
            this.logger.log(`Buscando contato com contactId: ${contactId}`);

            if (isDevelopment && !this.contactRepository) {
                // Modo desenvolvimento sem banco
                const contact = this.mockContacts.get(contactId) || null;
                if (contact) {
                    this.logger.log(`[MOCK] Contato encontrado: ID ${contact.id}, Nome: ${contact.nome}`);
                } else {
                    this.logger.log(`[MOCK] Nenhum contato encontrado com contactId: ${contactId}`);
                }
                return contact;
            }

            if (!this.contactRepository) {
                throw new Error('Repository não disponível');
            }

            const contact = await this.contactRepository.findOne({
                where: { contactid: contactId }
            });

            if (contact) {
                this.logger.log(`Contato encontrado: ID ${contact.id}, Nome: ${contact.nome}`);
                return contact;
            } else {
                this.logger.log(`Nenhum contato encontrado com contactId: ${contactId}`);
                return null;
            }
        } catch (error) {
            this.logger.error(`Erro ao buscar contato ${contactId}:`, error);
            throw error;
        }
    }

    /**
     * Cria um novo contato no banco de dados
     */
    async createContact(contactData: Partial<Contact>): Promise<Contact> {
        try {
            this.logger.log(`Criando novo contato com contactId: ${contactData.contactid}`);

            if (isDevelopment && !this.contactRepository) {
                // Modo desenvolvimento sem banco
                if (!contactData.contactid) {
                    throw new Error('ContactId é obrigatório');
                }

                const mockContact: Contact = {
                    id: Date.now(), // ID mock
                    ...contactData
                } as Contact;

                this.mockContacts.set(contactData.contactid, mockContact);
                this.logger.log(`[MOCK] Contato criado com sucesso: ID ${mockContact.id}`);
                return mockContact;
            }

            if (!this.contactRepository) {
                throw new Error('Repository não disponível');
            }

            const contact = this.contactRepository.create(contactData);
            const savedContact = await this.contactRepository.save(contact);

            this.logger.log(`Contato criado com sucesso: ID ${savedContact.id}`);
            return savedContact;
        } catch (error) {
            this.logger.error('Erro ao criar contato:', error);
            throw error;
        }
    }

    /**
     * Atualiza um contato existente
     */
    async updateContact(id: number, updateData: Partial<Contact>): Promise<Contact | null> {
        try {
            this.logger.log(`Atualizando contato ID: ${id}`);

            if (isDevelopment && !this.contactRepository) {
                // Modo desenvolvimento sem banco - busca na memória
                for (const [contactId, contact] of this.mockContacts.entries()) {
                    if (contact.id === id) {
                        const updatedContact = { ...contact, ...updateData };
                        this.mockContacts.set(contactId, updatedContact);
                        this.logger.log(`[MOCK] Contato atualizado com sucesso: ID ${id}`);
                        return updatedContact;
                    }
                }
                return null;
            }

            if (!this.contactRepository) {
                throw new Error('Repository não disponível');
            }

            await this.contactRepository.update(id, updateData);
            const updatedContact = await this.contactRepository.findOne({
                where: { id }
            });

            if (updatedContact) {
                this.logger.log(`Contato atualizado com sucesso: ID ${id}`);
            }
            return updatedContact;
        } catch (error) {
            this.logger.error(`Erro ao atualizar contato ${id}:`, error);
            throw error;
        }
    }

    /**
     * Atualiza a última mensagem de um contato
     */
    async updateLastMessage(contactId: number, message: string): Promise<void> {
        try {
            if (isDevelopment && !this.contactRepository) {
                // Modo desenvolvimento sem banco
                const contact = this.mockContacts.get(contactId);
                if (contact) {
                    contact.lastmessage = message;
                    contact.body = message;
                    this.mockContacts.set(contactId, contact);
                }
                this.logger.log(`[MOCK] Última mensagem atualizada para contactId: ${contactId}`);
                return;
            }

            if (!this.contactRepository) {
                throw new Error('Repository não disponível');
            }

            await this.contactRepository.update(
                { contactid: contactId },
                { lastmessage: message, body: message }
            );
            this.logger.log(`Última mensagem atualizada para contactId: ${contactId}`);
        } catch (error) {
            this.logger.error(`Erro ao atualizar última mensagem do contato ${contactId}:`, error);
            throw error;
        }
    }

    /**
     * Marca um contato como em atendimento
     */
    async setInService(contactId: number, inService: boolean = true): Promise<void> {
        try {
            if (isDevelopment && !this.contactRepository) {
                // Modo desenvolvimento sem banco
                const contact = this.mockContacts.get(contactId);
                if (contact) {
                    contact.ematendimento = inService;
                    this.mockContacts.set(contactId, contact);
                }
                this.logger.log(`[MOCK] Contato ${contactId} marcado como ${inService ? 'em atendimento' : 'fora de atendimento'}`);
                return;
            }

            if (!this.contactRepository) {
                throw new Error('Repository não disponível');
            }

            await this.contactRepository.update(
                { contactid: contactId },
                { ematendimento: inService }
            );
            this.logger.log(`Contato ${contactId} marcado como ${inService ? 'em atendimento' : 'fora de atendimento'}`);
        } catch (error) {
            this.logger.error(`Erro ao atualizar status de atendimento do contato ${contactId}:`, error);
            throw error;
        }
    }

    /**
     * Para o chatbot para um contato específico
     */
    async stopChatbot(contactId: number, stop: boolean = true): Promise<void> {
        try {
            if (isDevelopment && !this.contactRepository) {
                // Modo desenvolvimento sem banco
                const contact = this.mockContacts.get(contactId);
                if (contact) {
                    contact.stopchatbot = stop;
                    this.mockContacts.set(contactId, contact);
                }
                this.logger.log(`[MOCK] Chatbot ${stop ? 'pausado' : 'reativado'} para contactId: ${contactId}`);
                return;
            }

            if (!this.contactRepository) {
                throw new Error('Repository não disponível');
            }

            await this.contactRepository.update(
                { contactid: contactId },
                { stopchatbot: stop }
            );
            this.logger.log(`Chatbot ${stop ? 'pausado' : 'reativado'} para contactId: ${contactId}`);
        } catch (error) {
            this.logger.error(`Erro ao atualizar status do chatbot para contato ${contactId}:`, error);
            throw error;
        }
    }

    /**
     * Verifica se deve processar mensagem do contato
     */
    async shouldProcessMessage(contactId: number): Promise<boolean> {
        try {
            const contact = await this.findByContactId(contactId);

            if (!contact) {
                return true; // Se não existe, pode processar (será criado)
            }

            // Não processa se chatbot está parado
            if (contact.stopchatbot) {
                this.logger.log(`Chatbot pausado para contactId: ${contactId}`);
                return false;
            }

            // Não processa se já está em atendimento humano
            if (contact.ematendimento) {
                this.logger.log(`Contato ${contactId} já está em atendimento humano`);
                return false;
            }

            return true;
        } catch (error) {
            this.logger.error(`Erro ao verificar se deve processar mensagem do contato ${contactId}:`, error);
            return false;
        }
    }
}
