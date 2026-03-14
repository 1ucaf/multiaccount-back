import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  transfer_recipient_account_id: string;

  @IsDateString()
  payment_date: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  period_start: string;

  @IsDateString()
  period_end: string;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
