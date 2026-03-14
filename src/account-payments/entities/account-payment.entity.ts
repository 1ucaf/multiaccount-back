import { Column, Entity } from 'typeorm';
import { DomainEntity } from 'src/common/entities/domain.entity';

@Entity('account_payment')
export class AccountPaymentEntity extends DomainEntity {
  @Column('uuid')
  account_id: string;

  @Column('uuid')
  transfer_recipient_account_id: string;

  @Column({ type: 'date' })
  payment_date: Date;

  @Column({ type: 'number' })
  amount: number;

  @Column({ type: 'date' })
  period_start: Date;

  @Column({ type: 'date' })
  period_end: Date;

  @Column({ nullable: true })
  notes: string | null;
}
