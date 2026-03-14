import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { TransferRecipientAccountsService } from './transfer-recipient-accounts.service';
import { CreateTransferRecipientAccountDto } from './dto/create-transfer-recipient-account.dto';
import { UpdateTransferRecipientAccountDto } from './dto/update-transfer-recipient-account.dto';

@Controller('transfer-recipient-accounts')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(Role.MASTER)
export class TransferRecipientAccountsController {
  constructor(private readonly service: TransferRecipientAccountsService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  create(@Body() dto: CreateTransferRecipientAccountDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransferRecipientAccountDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
