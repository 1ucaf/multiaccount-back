import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccountsService } from './accounts.service';
import { GetAccountsQuery } from './queries/getAccounts.query';

@Controller('accounts')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(Role.MASTER)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.MASTER)
  async getAccounts(query: GetAccountsQuery) {
    return this.accountsService.getAccounts(query);
  }
}
