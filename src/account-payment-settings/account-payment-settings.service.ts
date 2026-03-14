import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountPaymentSettingsEntity } from './entities/account-payment-settings.entity';
import { CreatePaymentSettingsDto } from './dto/create-payment-settings.dto';
import { GlobalSettingsService } from '../global-settings/global-settings.service';
import { TransferRecipientAccountsService } from '../transfer-recipient-accounts/transfer-recipient-accounts.service';
import { AccountPaymentsService } from '../account-payments/account-payments.service';
import { AccountsService } from '../accounts/accounts.service';

export interface PaymentInfoForAccount {
  payment_alias: string | null;
  payment_cbu: string | null;
  recipient_name: string | null;
  recipient_cuit: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  notification_message: string | null;
  alert_message: string | null;
  monthly_payment_day?: number;
  notification_enabled?: boolean;
  notification_days_before?: number;
  alert_enabled?: boolean;
  system_enabled?: boolean;
  is_suspended?: boolean;
}

export type PaymentStatusResult =
  | { status: 'current' }
  | { status: 'overdue'; daysOverdue: number };

@Injectable()
export class AccountPaymentSettingsService {
  constructor(
    @InjectRepository(AccountPaymentSettingsEntity)
    private readonly repository: Repository<AccountPaymentSettingsEntity>,
    private readonly globalSettingsService: GlobalSettingsService,
    private readonly transferRecipientAccountsService: TransferRecipientAccountsService,
    private readonly accountPaymentsService: AccountPaymentsService,
    private readonly accountsService: AccountsService,
  ) {}

  async getByAccountId(accountId: string): Promise<AccountPaymentSettingsEntity | null> {
    return this.repository.findOne({ where: { account_id: accountId } as any });
  }

  async createOrUpdate(accountId: string, dto: CreatePaymentSettingsDto): Promise<AccountPaymentSettingsEntity> {
    const existing = await this.getByAccountId(accountId);
    const data = {
      account_id: accountId,
      monthly_payment_day: dto.monthly_payment_day,
      notification_enabled: dto.notification_enabled ?? true,
      notification_days_before: dto.notification_days_before ?? 1,
      alert_enabled: dto.alert_enabled ?? true,
      system_enabled: dto.system_enabled ?? true,
      transfer_recipient_account_id: dto.transfer_recipient_account_id ?? null,
      contact_phone: dto.contact_phone ?? null,
      contact_email: dto.contact_email ?? null,
      notification_message: dto.notification_message ?? null,
      alert_message: dto.alert_message ?? null,
    };
    if (existing) {
      Object.assign(existing, data);
      return this.repository.save(existing);
    }
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async getPaymentInfoForAccount(accountId: string): Promise<PaymentInfoForAccount> {
    const settings = await this.getByAccountId(accountId);
    const globalSettings = await this.globalSettingsService.get();
    const defaultRecipientId = globalSettings.default_transfer_recipient_account_id;
    const defaultRecipient = defaultRecipientId
      ? await this.transferRecipientAccountsService.getById(defaultRecipientId)
      : null;
    const accountRecipientId = settings?.transfer_recipient_account_id;
    const accountRecipient = accountRecipientId
      ? await this.transferRecipientAccountsService.getById(accountRecipientId)
      : null;
    const recipient = accountRecipient || defaultRecipient;

    const account = await this.accountsService.getById(accountId);
    return {
      payment_alias: recipient?.payment_alias ?? null,
      payment_cbu: recipient?.payment_cbu ?? null,
      recipient_name: recipient?.recipient_name ?? null,
      recipient_cuit: recipient?.recipient_cuit ?? null,
      contact_phone: settings?.contact_phone ?? globalSettings.default_contact_phone ?? null,
      contact_email: settings?.contact_email ?? globalSettings.default_contact_email ?? null,
      notification_message: settings?.notification_message ?? globalSettings.default_notification_message ?? null,
      alert_message: settings?.alert_message ?? globalSettings.default_alert_message ?? null,
      monthly_payment_day: settings?.monthly_payment_day,
      notification_enabled: settings?.notification_enabled,
      notification_days_before: settings?.notification_days_before,
      alert_enabled: settings?.alert_enabled,
      system_enabled: settings?.system_enabled,
      is_suspended: account?.isSuspended ?? false,
    };
  }

  async getPaymentStatus(accountId: string): Promise<PaymentStatusResult> {
    const settings = await this.getByAccountId(accountId);
    if (!settings) {
      return { status: 'current' };
    }
    const lastPayment = await this.accountPaymentsService.getLastPayment(accountId);
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const paymentDateThisMonth = new Date(year, month, Math.min(settings.monthly_payment_day, 28));
    if (settings.monthly_payment_day > 28) {
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
      paymentDateThisMonth.setDate(Math.min(settings.monthly_payment_day, lastDayOfMonth));
    }
    if (today <= paymentDateThisMonth) {
      return { status: 'current' };
    }
    const periodEnd = lastPayment?.period_end ? new Date(lastPayment.period_end) : null;
    if (periodEnd && periodEnd >= paymentDateThisMonth) {
      return { status: 'current' };
    }
    const daysOverdue = Math.floor((today.getTime() - paymentDateThisMonth.getTime()) / (1000 * 60 * 60 * 24));
    return { status: 'overdue', daysOverdue };
  }
}
