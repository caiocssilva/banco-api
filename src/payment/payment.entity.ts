import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Account } from '../account/account.entity';

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account, account => account.payments)
    account: Account;

    @Column('decimal', { precision: 10, scale: 2 })
    valor: number;

    @Column()
    data: Date;

    @Column()
    descricao: string;

    @Column({ nullable: true })
    imageUrl: string; 
}
