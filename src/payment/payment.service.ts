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

    async create(paymentData: Payment, file: Express.Multer.File): Promise<Payment> {
        const payment = new Payment();
        payment.valor = paymentData.valor;
        payment.data = new Date(paymentData.data);
        payment.descricao = paymentData.descricao;

        payment.account = await this.accountService.findById(paymentData.account.id);

        if (!payment.account) {
            throw new Error('Conta não encontrada');
        }

        if (payment.account.saldoInicial < payment.valor) {
            throw new Error('Saldo insuficiente');
        }

        if (file) {
            const key = `uploads/${Date.now()}_${file.originalname}`;
            const imageUrl = await this.uploadService.uploadFile(file, key);
            payment.imageUrl = imageUrl;
        }

        payment.account.saldoInicial -= payment.valor;
        await this.accountService.update(payment.account.id, payment.account);
        return this.paymentRepository.save(payment);
    }

    findAll(): Promise<Payment[]> {
        return this.paymentRepository.find();
    }

    findByAccount(accountId: number): Promise<Payment[]> {
        return this.paymentRepository.find({ where: { account: { id: accountId } } });
    }

    async generateReport(accountId: number, startDate: Date, endDate: Date): Promise<any> {
        try {
            const payments = await this.paymentRepository.find({
                where: {
                    account: { id: accountId },
                    data: Between(startDate, endDate),
                },
            });
    
            if (!payments || payments.length === 0) {
                return { payments: [], total: 0 };
            }

            const formattedPayments = payments.map(payment => ({
                valor: payment.valor.toString(),
                data: payment.data.toLocaleString('pt-BR', { timeZone: 'UTC' }),
                descricao: payment.descricao,
                imageUrl: payment.imageUrl || null,
            }));
    
            const total = formattedPayments.reduce((sum, payment) => sum + parseFloat(payment.valor.toString()), 0);

            return { payments: formattedPayments, total };
        } catch (error) {
            throw new Error(`Erro ao gerar relatório de transações: ${error.message}`);
        }
    }
}    