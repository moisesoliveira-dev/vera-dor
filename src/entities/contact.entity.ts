import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_contact')
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    mediapath: string;

    @Column({ type: 'text', nullable: true })
    body: string;

    @Column({ type: 'text', nullable: true })
    mediatype: string;

    @Column({ type: 'integer', nullable: true })
    ticketid: number;

    @Column({ type: 'integer', nullable: true })
    contactid: number;

    @Column({ type: 'integer', nullable: true })
    userid: number;

    @Column({ type: 'text', nullable: true })
    nome: string;

    @Column({ type: 'boolean', default: false })
    ematendimento: boolean;

    @Column({ type: 'boolean', default: false })
    finalizoutriagem: boolean;

    @Column({ type: 'boolean', default: false })
    stopchatbot: boolean;

    @Column({ type: 'integer', nullable: true })
    templateid: number;

    @Column({ type: 'boolean', default: false })
    pararmensagem: boolean;

    @Column({ type: 'text', nullable: true })
    lastmessage: string;

    @Column({ type: 'integer', nullable: true })
    state: number;

    @Column({ type: 'text', nullable: true })
    fase_arquivos: string;

    @Column({ type: 'integer', nullable: true })
    id_atendente: number;

    @Column({ type: 'text', nullable: true })
    numero: string;

    @Column({ type: 'text', nullable: true })
    local: string;

    @Column({ type: 'integer', nullable: true })
    id_queue: number;

    @Column({ type: 'boolean', default: false })
    mensagem_invalida: boolean;
}
