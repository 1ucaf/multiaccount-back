import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class AccountStatusGuard implements CanActivate {
  constructor(private readonly accountsService: AccountsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return true;
    if (user.roles?.includes(Role.MASTER)) return true;
    const accountId = user.account_id;
    if (!accountId) return true;
    const account = await this.accountsService.getById(accountId);
    if (!account) return true;
    if (account.isSuspended) {
      throw new ForbiddenException(
        'Su cuenta ha sido suspendida por falta de pago. Contacte al administrador.',
      );
    }
    return true;
  }
}
