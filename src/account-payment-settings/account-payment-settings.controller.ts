import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccountPaymentSettingsService } from './account-payment-settings.service';
import { CreatePaymentSettingsDto } from './dto/create-payment-settings.dto';

@Controller('accounts')
@UseGuards(AuthGuard())
export class AccountPaymentSettingsController {
  constructor(private readonly service: AccountPaymentSettingsService) {}

  @Get(':id/payment-settings')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  getByAccountId(@Param('id') id: string) {
    return this.service.getByAccountId(id);
  }

  @Post(':id/payment-settings')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  createOrUpdate(@Param('id') id: string, @Body() dto: CreatePaymentSettingsDto) {
    return this.service.createOrUpdate(id, dto);
  }

  @Get(':id/payment-status')
  @UseGuards(RolesGuard)
  @Roles(Role.MASTER)
  getPaymentStatus(@Param('id') id: string) {
    return this.service.getPaymentStatus(id);
  }
}
