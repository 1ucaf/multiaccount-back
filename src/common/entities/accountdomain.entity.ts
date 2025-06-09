import { Column, Entity } from "typeorm";
import { DomainEntity } from "./domain.entity";
import { AccountEntity } from "src/accounts/entities/account.entity";

@Entity()
export class AccountDomainEntity extends DomainEntity {
  @Column('uuid')
  account_id: string;

  account?: AccountEntity;
}