import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { BooksModule } from './books/books.module';
import { BookEntity } from './books/entities/book.entity';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AccountEntity } from './accounts/entities/account.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantContextInterceptor } from './auth/tenancy/tenant-context.interceptor';
import { CryptoModule } from './common/crypto/crypto.module';
import { GlobalSettingsEntity } from './global-settings/entities/global-settings.entity';
import { GlobalSettingsModule } from './global-settings/global-settings.module';
import { TransferRecipientAccountEntity } from './transfer-recipient-accounts/entities/transfer-recipient-account.entity';
import { TransferRecipientAccountsModule } from './transfer-recipient-accounts/transfer-recipient-accounts.module';
import { AccountPaymentSettingsEntity } from './account-payment-settings/entities/account-payment-settings.entity';
import { AccountPaymentSettingsModule } from './account-payment-settings/account-payment-settings.module';
import { AccountPaymentEntity } from './account-payments/entities/account-payment.entity';
import { AccountPaymentsModule } from './account-payments/account-payments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CryptoModule,
    TypeOrmModule.forRoot({
      type: "mongodb",
      url: process.env.DATABASE_URL,
      entities: [
        UserEntity,
        BookEntity,
        AccountEntity,
        GlobalSettingsEntity,
        TransferRecipientAccountEntity,
        AccountPaymentSettingsEntity,
        AccountPaymentEntity,
      ],
      database: process.env.DATABASE_NAME,
      synchronize: true,
    }),
    AuthModule,
    BooksModule,
    UsersModule,
    AccountsModule,
    PermissionsModule,
    GlobalSettingsModule,
    AccountPaymentsModule,
    TransferRecipientAccountsModule,
    AccountPaymentSettingsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantContextInterceptor,
    },
  ],
})
export class AppModule { }
