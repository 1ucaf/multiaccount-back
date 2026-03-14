import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountPaymentEntity } from './entities/account-payment.entity';
import { AccountPaymentsService } from './account-payments.service';
import { AccountPaymentsController } from './account-payments.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([AccountPaymentEntity]),
  ],
  controllers: [AccountPaymentsController],
  providers: [AccountPaymentsService],
  exports: [AccountPaymentsService],
})
export class AccountPaymentsModule {}
