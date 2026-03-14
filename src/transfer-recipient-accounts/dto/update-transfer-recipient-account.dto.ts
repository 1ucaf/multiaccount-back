import { PartialType } from '@nestjs/mapped-types';
import { CreateTransferRecipientAccountDto } from './create-transfer-recipient-account.dto';

export class UpdateTransferRecipientAccountDto extends PartialType(CreateTransferRecipientAccountDto) {}
