import { Exclude } from "class-transformer";
import { BeforeInsert, CreateDateColumn, Entity, BaseEntity, ObjectIdColumn, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class DomainEntity extends BaseEntity {
  @Exclude()
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  date_created: Date;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }
}