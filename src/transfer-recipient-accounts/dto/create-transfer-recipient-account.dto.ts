import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTransferRecipientAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  payment_alias: string;

  @IsString()
  @IsNotEmpty()
  payment_cbu: string;

  @IsString()
  @IsNotEmpty()
  recipient_name: string;

  @IsString()
  @IsNotEmpty()
  recipient_cuit: string;
}
