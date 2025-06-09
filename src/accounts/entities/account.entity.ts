import { DomainEntity } from "src/common/entities/domain.entity";
import { Column, Entity } from "typeorm";

@Entity('account')
export class AccountEntity extends DomainEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  isActive: boolean;
}