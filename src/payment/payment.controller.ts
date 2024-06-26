import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';
import { AccountService } from '../account/account.service';
import { PaymentDTO } from './payment.dto'; 
import { S3Service } from '../s3/s3.service';

@Controller('payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly accountService: AccountService,
        private readonly s3Service: S3Service,
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body() paymentData: PaymentDTO, @UploadedFile() file: Express.Multer.File): Promise<Payment> {
        const payment = new Payment();
        payment.valor = paymentData.valor;
        payment.descricao = paymentData.descricao;
        payment.data = new Date();
        payment.account = await this.accountService.findById(paymentData.accountId);
    
        return this.paymentService.create(payment, file);
    }

    @Get()
    findAll(): Promise<Payment[]> {
        return this.paymentService.findAll();
    }

    @Get(':accountId')
    findByAccount(@Param('accountId') accountId: number): Promise<Payment[]> {
        return this.paymentService.findByAccount(accountId);
    }

    @Get('report/:accountId')
    generateReport(
        @Param('accountId') accountId: number,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ): Promise<any> {

        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return this.paymentService.generateReport(accountId, new Date(startDate), new Date(endDate));
    }
}
