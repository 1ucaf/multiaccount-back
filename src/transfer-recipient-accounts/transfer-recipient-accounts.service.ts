import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferRecipientAccountEntity } from './entities/transfer-recipient-account.entity';
import { CreateTransferRecipientAccountDto } from './dto/create-transfer-recipient-account.dto';
import { UpdateTransferRecipientAccountDto } from './dto/update-transfer-recipient-account.dto';
import { GlobalSettingsEntity } from '../global-settings/entities/global-settings.entity';
import { AccountPaymentSettingsEntity } from '../account-payment-settings/entities/account-payment-settings.entity';
import { AccountPaymentEntity } from '../account-payments/entities/account-payment.entity';

@Injectable()
export class TransferRecipientAccountsService {
  constructor(
    @InjectRepository(TransferRecipientAccountEntity)
    private readonly repository: Repository<TransferRecipientAccountEntity>,
    @InjectRepository(GlobalSettingsEntity)
    private readonly globalSettingsRepository: Repository<GlobalSettingsEntity>,
    @InjectRepository(AccountPaymentSettingsEntity)
    private readonly accountPaymentSettingsRepository: Repository<AccountPaymentSettingsEntity>,
    @InjectRepository(AccountPaymentEntity)
    private readonly accountPaymentsRepository: Repository<AccountPaymentEntity>,
  ) {}

  async create(dto: CreateTransferRecipientAccountDto): Promise<TransferRecipientAccountEntity> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async getById(id: string): Promise<TransferRecipientAccountEntity | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async getAll(): Promise<TransferRecipientAccountEntity[]> {
    return this.repository.find({ order: { date_created: 'DESC' } as any });
  }

  async update(id: string, dto: UpdateTransferRecipientAccountDto): Promise<TransferRecipientAccountEntity> {
    const entity = await this.getById(id);
    if (!entity) {
      throw new NotFoundException('Transfer recipient account not found');
    }
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.getById(id);
    if (!entity) {
      throw new NotFoundException('Transfer recipient account not found');
    }
    const [globalSettings] = await this.globalSettingsRepository.find({ take: 1 });
    if (globalSettings?.default_transfer_recipient_account_id === id) {
      throw new ConflictException(
        'Cannot delete: in use as default recipient in global settings.',
      );
    }
    const settingsInUse = await this.accountPaymentSettingsRepository.count({
      where: { transfer_recipient_account_id: id } as any,
    });
    if (settingsInUse > 0) {
      throw new ConflictException(
        'Cannot delete: in use in payment settings of one or more accounts.',
      );
    }
    const paymentsInUse = await this.accountPaymentsRepository.count({
      where: { transfer_recipient_account_id: id } as any,
    });
    if (paymentsInUse > 0) {
      throw new ConflictException(
        'Cannot delete: referenced in payment records.',
      );
    }
    await this.repository.delete({ id } as any);
  }
}
