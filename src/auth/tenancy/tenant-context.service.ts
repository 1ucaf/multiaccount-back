import { AsyncLocalStorage } from 'async_hooks';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';

interface TenantContext {
  account_id: string;
  user: UserEntity;
}

@Injectable()
export class TenantContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<TenantContext>();

  run({account_id, user}, callback: () => void) {
    this.asyncLocalStorage.run({ account_id, user }, callback);
  }

  getContext(): TenantContext {
    return this.asyncLocalStorage.getStore();
  }
}
