import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferRecipientAccountEntity } from './entities/transfer-recipient-account.entity';
import { TransferRecipientAccountsService } from './transfer-recipient-accounts.service';
import { TransferRecipientAccountsController } from './transfer-recipient-accounts.controller';
import { AuthModule } from 'src/auth/auth.module';
import { GlobalSettingsEntity } from '../global-settings/entities/global-settings.entity';
import { AccountPaymentSettingsEntity } from '../account-payment-settings/entities/account-payment-settings.entity';
import { AccountPaymentEntity } from '../account-payments/entities/account-payment.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      TransferRecipientAccountEntity,
      GlobalSettingsEntity,
      AccountPaymentSettingsEntity,
      AccountPaymentEntity,
    ]),
  ],
  controllers: [TransferRecipientAccountsController],
  providers: [TransferRecipientAccountsService],
  exports: [TransferRecipientAccountsService],
})
export class TransferRecipientAccountsModule {}
