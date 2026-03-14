import { Controller, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountPaymentSettingsService } from './account-payment-settings.service';

@Controller('payment-info')
@UseGuards(AuthGuard())
export class PaymentInfoController {
  constructor(private readonly service: AccountPaymentSettingsService) {}

  @Get()
  async getPaymentInfo(@Req() req: { user: { account_id?: string } }) {
    const accountId = req.user?.account_id;
    if (!accountId) {
      throw new UnauthorizedException('Account context required');
    }
    return this.service.getPaymentInfoForAccount(accountId);
  }

  @Get('status')
  async getPaymentStatus(@Req() req: { user: { account_id?: string } }) {
    const accountId = req.user?.account_id;
    if (!accountId) {
      throw new UnauthorizedException('Account context required');
    }
    return this.service.getPaymentStatus(accountId);
  }
}
