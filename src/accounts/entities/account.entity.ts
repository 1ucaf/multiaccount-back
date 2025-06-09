import { DomainEntity } from "src/lib/entities/domain.entity";
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