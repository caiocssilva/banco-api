import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    create(@Body() payment: Payment, @UploadedFile() file: Express.Multer.File): Promise<Payment> {
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
        return this.paymentService.generateReport(accountId, new Date(startDate), new Date(endDate));
    }
}
