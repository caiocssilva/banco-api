import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PaymentModule } from './payment/payment.module';
import { UploadModule } from './upload/upload.module';
import { User } from './users/user.entity';
import { Account } from './account/account.entity';
import { Payment } from './payment/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432, 
      username: 'postgres',
      password: '051920', 
      database: 'BancoCC', 
      entities: [User, Account, Payment], 
      synchronize: true,
    }),
    AccountModule,
    AuthModule,
    UsersModule,
    PaymentModule,
    UploadModule,
  ],
})
export class AppModule { }