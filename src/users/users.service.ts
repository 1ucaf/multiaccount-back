import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getPaginatedQuery } from 'src/common/utils/paginatedQuery';
import { GetUsersQuery } from './queries/getUsers.query';
import { Role } from 'src/auth/enums/role.enum';
import { UserRoleDTO } from './dto/userRole.dto';
import { PutUserDTO } from './dto/putUser.dto';
import {
  AllAdminUserPermissionsKeys,
  Permission,
  RegularUserPermissionsKeys
} from 'src/permissions/dictionary/permissions.dictionary';
import { IsAdminDTO } from './dto/IsAdmin.dto';
import { TenantContextService } from 'src/auth/tenancy/tenant-context.service';

interface IUserCreate {
  name: string;
  email: string;
  password: string;
  account_id: string;
  isActive: boolean;
  roles: Role[];
  permissions: Permission[];
}

@Injectable()
export class UsersService {
  private account_id: string;
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly tenantContext: TenantContextService,
  ) {
    this.account_id = this.tenantContext.getContext().accountId
  }
  async getUsers(query: GetUsersQuery) {
    const {
      role,
      isActive,
      showDeleted,
    } = query;
    const where: any = {account_id: this.account_id};
    if(!showDeleted) where.isDeleted = false;
    if (role) {
      if(role === Role.USER) where.roles = { $in: [Role.USER], $not: { $in: [Role.ADMIN] } };
      else where.roles = { $in: [role] };
    };
    if(isActive !== undefined) where.isActive = isActive;
    const findQuery = getPaginatedQuery<GetUsersQuery, UserEntity>({
      query,
      searchByArray: ['name', 'email'],
      otherWhereConditions: where,
    });
    const [results, count] = await this.usersRepository.findAndCount(findQuery);
    const totalPages = Math.ceil(count / query.pageSize);
    return {
      results,
      count,
      totalPages,
      page: query.page,
      pageSize: query.pageSize,
    }
  }
  getById(id: string) {
    return this.usersRepository.findOne({
      where: { id }
    });
  }
  getByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email }
    });
  }
  async createUser(user: IUserCreate) {
    const existingUserWithinAccount = await this.usersRepository.findOne({ where: { email: user.email, account_id: user.account_id } });

    if (existingUserWithinAccount) {
      throw new ConflictException('User with this email already exists');
    }
    
    const newUser: UserEntity = await this.usersRepository.create({
      ...user,
      isDeleted: false,
      account_id: user.account_id
    });

    return await this.usersRepository.save(newUser);
  }
  activateUser(userId: string, body: UserRoleDTO) {
    const permissions = body.roles.includes(Role.ADMIN) ? AllAdminUserPermissionsKeys : RegularUserPermissionsKeys;
    return this.usersRepository.update(
      { id: userId, account_id: this.account_id },
      {
        isActive: true,
        roles: body.roles,
        permissions,
        isDeleted: false,
      }
    );
  }
  editUser(userId: string, body: PutUserDTO) {
    return this.usersRepository.update(
      { id: userId, account_id: this.account_id },
      {
        name: body.name,
        email: body.email
      }
    );
  }
  setAdmin(userId: string, body: IsAdminDTO) {
    const { isAdmin } = body;
    return this.usersRepository.update(
      { id: userId, account_id: this.account_id },
      {
        roles: isAdmin ? [Role.USER, Role.ADMIN] : [Role.USER],
      }
    );
  }
  editUserPermissions(userId: string, permissions: Permission[]) {
    return this.usersRepository.update(
      { id: userId, account_id: this.account_id },
      {
        permissions,
      }
    );
  }
  deleteUser(userId: string) {
    return this.usersRepository.update(
      { id: userId, account_id: this.account_id },
      {
        isActive: false,
        roles: [],
        permissions: [],
        isDeleted: true,
      }
    );
  }
}
