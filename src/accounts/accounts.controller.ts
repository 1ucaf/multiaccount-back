import { Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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

  @Get()
  async getAccounts(@Query() query: GetAccountsQuery) {
    return this.accountsService.getAccounts(query);
  }

  @Patch('pause/:id')
  async pauseAccount(@Param('id') id: string) {
    return this.accountsService.pauseAccount(id);
  }

  @Patch('resume/:id')
  async resumeAccount(@Param('id') id: string) {
    return this.accountsService.resumeAccount(id);
  }
}
