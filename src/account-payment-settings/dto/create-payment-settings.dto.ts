import { IsString, IsOptional, IsBoolean, IsInt, Min, Max, IsUUID } from 'class-validator';

export class CreatePaymentSettingsDto {
  @IsInt()
  @Min(1)
  @Max(31)
  monthly_payment_day: number;

  @IsOptional()
  @IsBoolean()
  notification_enabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  notification_days_before?: number;

  @IsOptional()
  @IsBoolean()
  alert_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  system_enabled?: boolean;

  @IsOptional()
  @IsUUID()
  transfer_recipient_account_id?: string | null;

  @IsOptional()
  @IsString()
  contact_phone?: string | null;

  @IsOptional()
  @IsString()
  contact_email?: string | null;

  @IsOptional()
  @IsString()
  notification_message?: string | null;

  @IsOptional()
  @IsString()
  alert_message?: string | null;
}
