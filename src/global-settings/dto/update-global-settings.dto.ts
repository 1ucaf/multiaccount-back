import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateGlobalSettingsDto {
  @IsOptional()
  @IsUUID()
  default_transfer_recipient_account_id?: string | null;

  @IsOptional()
  @IsString()
  default_contact_phone?: string;

  @IsOptional()
  @IsString()
  default_contact_email?: string;

  @IsOptional()
  @IsString()
  default_notification_message?: string;

  @IsOptional()
  @IsString()
  default_alert_message?: string;
}
