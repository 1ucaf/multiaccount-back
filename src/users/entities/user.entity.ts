import { Exclude } from "class-transformer";
import { Permission } from "src/permissions/dictionary/permissions.dictionary";
import { Role } from "src/auth/enums/role.enum";
import { Column, Entity } from "typeorm";
import { AccountDomainEntity } from "src/common/entities/accountdomain.entity";

@Entity('user')
export class UserEntity extends AccountDomainEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  roles: Role[];

  @Column()
  permissions: Permission[];

  @Column()
  isDeleted: boolean;
}