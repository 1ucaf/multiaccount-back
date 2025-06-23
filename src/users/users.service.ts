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
import { PostUserDTO } from './dto/postUser.dto';
import * as bcrypt from 'bcryptjs';

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
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly tenantContext: TenantContextService,
  ) { }
  async getUsers(query: GetUsersQuery) {
    const { account_id } = this.tenantContext.getContext();
    return await this.getAccountUsers(query, account_id);
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
  async postUser(user: PostUserDTO) {
    const { account_id } = this.tenantContext.getContext();
    const existingUserWithinAccount = await this.usersRepository.findOne({
      where: { email: user.email, account_id }
    });

    if (existingUserWithinAccount) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: UserEntity = await this.usersRepository.create({
      ...user,
      password: hashedPassword,
      isDeleted: false,
      account_id,
      roles: [Role.USER],
      permissions: RegularUserPermissionsKeys,
    });
    return await this.usersRepository.save(newUser);
  }
  async createUser(user: IUserCreate) {
    const existingUserWithinAccount = await this.usersRepository.findOne({
      where: { email: user.email, account_id: user.account_id }
    });

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
    const { account_id } = this.tenantContext.getContext();
    const permissions = body.roles.includes(Role.ADMIN) ? AllAdminUserPermissionsKeys : RegularUserPermissionsKeys;
    return this.usersRepository.update(
      { id: userId, account_id },
      {
        isActive: true,
        roles: body.roles,
        permissions,
        isDeleted: false,
      }
    );
  }
  editUser(userId: string, body: PutUserDTO) {
    const { account_id } = this.tenantContext.getContext();
    return this.usersRepository.update(
      { id: userId, account_id },
      {
        name: body.name,
        email: body.email
      }
    );
  }
  setAdmin(userId: string, body: IsAdminDTO) {
    const { account_id } = this.tenantContext.getContext();
    const { isAdmin } = body;
    return this.usersRepository.update(
      { id: userId, account_id },
      {
        roles: isAdmin ? [Role.USER, Role.ADMIN] : [Role.USER],
      }
    );
  }
  editUserPermissions(userId: string, permissions: Permission[]) {
    const { account_id } = this.tenantContext.getContext();
    return this.usersRepository.update(
      { id: userId, account_id },
      {
        permissions,
      }
    );
  }
  deleteUser(userId: string) {
    const { account_id } = this.tenantContext.getContext();
    return this.usersRepository.update(
      { id: userId, account_id },
      {
        isActive: false,
        roles: [],
        permissions: [],
        isDeleted: true,
      }
    );
  }
  updatePassword(userId: string, password: string) {
    const { account_id } = this.tenantContext.getContext();
    return this.usersRepository.update(
      { id: userId, account_id },
      {
        password: password,
        isActive: true,
      }
    );
  }
  async getOwnerByAccountId(accountId: string) {
    return await this.usersRepository.findOne({
      where: { account_id: accountId, roles: Role.OWNER },
    });
  }
  
  async getAccountUsers(query: GetUsersQuery, account_id: string) {
    const {
      role,
      isActive,
      showDeleted,
    } = query;
    const where: any = {account_id};
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
}
