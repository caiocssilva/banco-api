import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { AccountModule } from '../account/account.module';
import { UploadService } from '../upload/upload.service';
import { S3Service } from '../s3/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    AccountModule, 
  ],
  providers: [PaymentService, UploadService, S3Service],
  controllers: [PaymentController],
})
export class PaymentModule {}