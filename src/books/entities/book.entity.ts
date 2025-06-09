import { AccountDomainEntity } from "src/common/entities/accountdomain.entity";
import { Column, Entity } from "typeorm";

@Entity("books")
export class BookEntity extends AccountDomainEntity {
  @Column()
  title: string;

  @Column()
  description: string;
}