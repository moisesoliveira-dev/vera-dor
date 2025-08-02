import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tb_conversation')
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', unique: true })
    contactId: number;

    @Column({ type: 'integer' })
    ticketId: number;

    @Column({ type: 'varchar', length: 100 })
    contactName: string;

    @Column({ type: 'varchar', length: 20 })
    contactPhone: string;

    @Column({ type: 'varchar', length: 50, default: 'welcome' })
    currentStep: string;

    @Column({ type: 'json', nullable: true })
    stepData: any; // Para armazenar dados temporários da conversa

    @Column({ type: 'varchar', length: 200, nullable: true })
    lastMessage: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'boolean', default: false })
    transferredToHuman: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
