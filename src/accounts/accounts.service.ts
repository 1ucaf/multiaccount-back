import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from './entities/account.entity';
import { getPaginatedQuery } from 'src/common/utils/paginatedQuery';
import { GetAccountsQuery } from './queries/getAccounts.query';
import { SignUpDTO } from 'src/auth/dto/signup.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountsRepository: Repository<AccountEntity>,
  ) {}

  
  async createAccount(account: SignUpDTO) {
    const { email, company_name } = account;
    const newAccount: AccountEntity = await this.accountsRepository.create({
      name: company_name,
      email,
      isActive: true,
    });

    return await this.accountsRepository.save(newAccount);
  }

  async getAccounts(query: GetAccountsQuery) {
    const {
      pageSize = 10,
      page = 0,
      isActive,
    } = query;
    const where: any = {};
    if(isActive !== undefined) where.isActive = isActive;
    const findQuery = getPaginatedQuery<GetAccountsQuery, AccountEntity>({
      query,
      searchByArray: ['name', 'email'],
      otherWhereConditions: where,
    });
    const [results, count] = await this.accountsRepository.findAndCount(findQuery);
    const totalPages = Math.ceil(count / pageSize);
    return {
      results,
      count,
      totalPages,
      page: page,
      pageSize: pageSize,
    }
  }
  
  getByEmail(email: string) {
    return this.accountsRepository.findOne({
      where: { email }
    });
  }

  getById(id: string) {
    return this.accountsRepository.findOne({
      where: { id }
    });
  }

  async pauseAccount(id: string) {
    return await this.accountsRepository.update({ id }, { isActive: false });
  }
  
  async resumeAccount(id: string) {
    return await this.accountsRepository.update({ id }, { isActive: true });
  }
}
