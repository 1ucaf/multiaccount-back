import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { Role } from './enums/role.enum';
import { AllAdminUserPermissionsKeys } from 'src/permissions/dictionary/permissions.dictionary';
import { TenantContextService } from './tenancy/tenant-context.service';
import { ChangePasswordDTO } from './dto/changepassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly tenantContext: TenantContextService,
  ) {}
  async signUp(signUpDTO: SignUpDTO): Promise<{token: string}> {
    const { password } = signUpDTO;
    const existingAccount = await this.accountsService.getByEmail(signUpDTO.email);

    if (existingAccount) {
      throw new ConflictException('Account with this email already exists');
    }

    const newAccount = await this.accountsService.createAccount(signUpDTO);
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.createUser({
      ...signUpDTO,
      password: hashedPassword,
      account_id: newAccount.id,
      isActive: true,
      roles: [Role.ADMIN, Role.OWNER, Role.USER],
      permissions: AllAdminUserPermissionsKeys,
    })

    const token = this.jwtService.sign({ id: newUser.id });

    return { token };
  }

  async login(loginDTO: LoginDTO): Promise<{token: string}> {
    const { email, password } = loginDTO;

    const existingUser = await this.usersService.getByEmail(email);

    if (!existingUser) {
      throw new NotFoundException('User with this email does not exist');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.jwtService.sign({ id: existingUser.id });

    return { token };
  }

  async changePassword(changePasswordDTO: ChangePasswordDTO) {
    const { current_password, new_password } = changePasswordDTO;
    const { user } = this.tenantContext.getContext();
    const isPasswordValid = await bcrypt.compare(
      current_password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect.');
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await this.usersService.updatePassword(user.id, hashedPassword);
  }

  async impersonateAccount(id: string) {
    const user = await this.usersService.getOwnerByAccountId(id);

    return await this.impersonateUser(user.id);
  }
  async impersonateUser(id: string) {

    const token = this.jwtService.sign({ id });

    return { token };
  }
}