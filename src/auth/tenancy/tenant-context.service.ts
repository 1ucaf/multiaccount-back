import { AsyncLocalStorage } from 'async_hooks';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';

export interface TenantContext {
  account_id: string;
  user: UserEntity;
}

@Injectable()
export class TenantContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<TenantContext>();

  run({ account_id, user }: TenantContext, callback: () => void) {
    this.asyncLocalStorage.run({ account_id, user }, callback);
  }

  /** Runs callback with context; supports async and returns the result. Use for webhook/background processing. */
  runAsync<T>({ account_id, user }: TenantContext, callback: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.asyncLocalStorage.run({ account_id, user }, () => {
        void callback().then(resolve).catch(reject);
      });
    });
  }

  getContext(): TenantContext {
    return this.asyncLocalStorage.getStore();
  }
}
