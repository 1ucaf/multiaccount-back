import { Column, Entity } from 'typeorm';
import { DomainEntity } from 'src/common/entities/domain.entity';

@Entity('account_payment_settings')
export class AccountPaymentSettingsEntity extends DomainEntity {
  @Column('uuid')
  account_id: string;

  @Column({ type: 'int' })
  monthly_payment_day: number;

  @Column({ default: true })
  notification_enabled: boolean;

  @Column({ type: 'int', default: 1 })
  notification_days_before: number;

  @Column({ default: true })
  alert_enabled: boolean;

  @Column({ default: true })
  system_enabled: boolean;

  @Column('uuid', { nullable: true })
  transfer_recipient_account_id: string | null;

  @Column({ nullable: true })
  contact_phone: string | null;

  @Column({ nullable: true })
  contact_email: string | null;

  @Column({ nullable: true })
  notification_message: string | null;

  @Column({ nullable: true })
  alert_message: string | null;
}
