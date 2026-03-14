import { DomainEntity } from 'src/common/entities/domain.entity';
import { Column, Entity } from 'typeorm';

@Entity('transfer_recipient_account')
export class TransferRecipientAccountEntity extends DomainEntity {
  @Column()
  name: string;

  @Column()
  payment_alias: string;

  @Column()
  payment_cbu: string;

  @Column()
  recipient_name: string;

  @Column()
  recipient_cuit: string;
}
