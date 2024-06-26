import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payment } from './payment.entity';
import { AccountService } from '../account/account.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        private accountService: AccountService,
        private uploadService: UploadService,
    ) { }

    async create(payment: Payment, file: Express.Multer.File): Promise<Payment> {
        const account = await this.accountService.findById(payment.account.id);
        if (!account) {
            throw new Error('Conta não encontrada');
        }
        if (account.saldoInicial < payment.valor) {
            throw new Error('Saldo insuficiente');
        }
        if (file) {
            const imageUrl = await this.uploadService.uploadFile(file: Express.Multer.File, key: string);
            payment.imageUrl = imageUrl;
        }
        account.saldoInicial -= payment.valor;
        await this.accountService.update(account.id, account);
        return this.paymentRepository.save(payment);
    }

    findAll(): Promise<Payment[]> {
        return this.paymentRepository.find();
    }

    findByAccount(accountId: number): Promise<Payment[]> {
        return this.paymentRepository.find({ where: { account: { id: accountId } } });
    }

    async generateReport(accountId: number, startDate: Date, endDate: Date): Promise<any> {
        const payments = await this.paymentRepository.find({
            where: {
                account: { id: accountId },
                data: Between(startDate, endDate),
            },
        });
        const total = payments.reduce((sum, payment) => sum + payment.valor, 0);
        return { payments, total };
    }
}