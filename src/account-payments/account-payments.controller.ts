import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccountPaymentsService } from './account-payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetPaymentsQuery } from './queries/get-payments.query';

@Controller('accounts')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(Role.MASTER)
export class AccountPaymentsController {
  constructor(private readonly service: AccountPaymentsService) {}

  @Get(':id/payments')
  getByAccountId(@Param('id') id: string, @Query() query: GetPaymentsQuery) {
    return this.service.getByAccountId(id, query);
  }

  @Post(':id/payments')
  create(@Param('id') id: string, @Body() dto: CreatePaymentDto) {
    return this.service.create(id, dto);
  }
}
