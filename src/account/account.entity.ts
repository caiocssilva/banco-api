import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    tipoConta: string; // 'corrente', 'poupança'

    @Column('decimal', { precision: 10, scale: 2 })
    saldoInicial: number;
}
