import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountPaymentEntity } from './entities/account-payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetPaymentsQuery } from './queries/get-payments.query';
import { getPaginatedQuery } from 'src/common/utils/paginatedQuery';

@Injectable()
export class AccountPaymentsService {
  constructor(
    @InjectRepository(AccountPaymentEntity)
    private readonly repository: Repository<AccountPaymentEntity>,
  ) {}

  async create(accountId: string, dto: CreatePaymentDto): Promise<AccountPaymentEntity> {
    const entity = this.repository.create({
      account_id: accountId,
      transfer_recipient_account_id: dto.transfer_recipient_account_id,
      payment_date: new Date(dto.payment_date),
      amount: dto.amount,
      period_start: new Date(dto.period_start),
      period_end: new Date(dto.period_end),
      notes: dto.notes ?? null,
    });
    return this.repository.save(entity);
  }

  async getByAccountId(accountId: string, query: GetPaymentsQuery): Promise<{
    results: AccountPaymentEntity[];
    count: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }> {
    const { pageSize = 10, page = 0 } = query;
    const findQuery = getPaginatedQuery<GetPaymentsQuery, AccountPaymentEntity>({
      query: { ...query, account_id: accountId } as GetPaymentsQuery,
      searchByArray: [],
      otherWhereConditions: { account_id: accountId } as any,
    });
    const [results, count] = await this.repository.findAndCount(findQuery);
    const totalPages = Math.ceil(count / pageSize);
    return {
      results,
      count,
      totalPages,
      page,
      pageSize,
    };
  }

  async getLastPayment(accountId: string): Promise<AccountPaymentEntity | null> {
    const [payment] = await this.repository.find({
      where: { account_id: accountId } as any,
      order: { payment_date: 'DESC' } as any,
      take: 1,
    });
    return payment ?? null;
  }
}
