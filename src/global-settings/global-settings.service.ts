import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalSettingsEntity } from './entities/global-settings.entity';
import { UpdateGlobalSettingsDto } from './dto/update-global-settings.dto';

@Injectable()
export class GlobalSettingsService {
  constructor(
    @InjectRepository(GlobalSettingsEntity)
    private readonly repository: Repository<GlobalSettingsEntity>,
  ) {}

  async get(): Promise<GlobalSettingsEntity> {
    let settings = await this.repository.findOne({ where: {} });
    if (!settings) {
      settings = this.repository.create({
        default_transfer_recipient_account_id: null,
        default_contact_phone: '',
        default_contact_email: '',
        default_notification_message: '',
        default_alert_message: '',
      });
      settings = await this.repository.save(settings);
    }
    return settings;
  }

  async update(dto: UpdateGlobalSettingsDto): Promise<GlobalSettingsEntity> {
    const settings = await this.get();
    Object.assign(settings, dto);
    return this.repository.save(settings);
  }
}
