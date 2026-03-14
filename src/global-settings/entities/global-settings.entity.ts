import { DomainEntity } from 'src/common/entities/domain.entity';
import { Column, Entity } from 'typeorm';

@Entity('global_settings')
export class GlobalSettingsEntity extends DomainEntity {
  @Column({ nullable: true })
  default_transfer_recipient_account_id: string | null;

  @Column({ default: '' })
  default_contact_phone: string;

  @Column({ default: '' })
  default_contact_email: string;

  @Column({ default: '' })
  default_notification_message: string;

  @Column({ default: '' })
  default_alert_message: string;
}
