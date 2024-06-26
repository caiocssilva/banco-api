import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Payment } from '../payment/payment.entity';
import { IsIn } from 'class-validator';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    @IsIn(['corrente', 'poupança'], { message: 'Tipo de conta deve ser "corrente" ou "poupança"' })
    tipoConta: string;

    @Column('decimal', { precision: 10, scale: 2 })
    saldoInicial: number;

    @OneToMany(() => Payment, payment => payment.account)
    payments: Payment[];
}
