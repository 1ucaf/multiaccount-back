import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountPaymentSettingsEntity } from './entities/account-payment-settings.entity';
import { AccountPaymentSettingsService } from './account-payment-settings.service';
import { AccountPaymentSettingsController } from './account-payment-settings.controller';
import { PaymentInfoController } from './payment-info.controller';
import { GlobalSettingsModule } from '../global-settings/global-settings.module';
import { TransferRecipientAccountsModule } from '../transfer-recipient-accounts/transfer-recipient-accounts.module';
import { AccountPaymentsModule } from '../account-payments/account-payments.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([AccountPaymentSettingsEntity]),
    GlobalSettingsModule,
    TransferRecipientAccountsModule,
    AccountPaymentsModule,
    AccountsModule,
  ],
  controllers: [AccountPaymentSettingsController, PaymentInfoController],
  providers: [AccountPaymentSettingsService],
  exports: [AccountPaymentSettingsService],
})
export class AccountPaymentSettingsModule {}
