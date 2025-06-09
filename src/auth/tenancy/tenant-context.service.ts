import { AsyncLocalStorage } from 'async_hooks';
import { Injectable } from '@nestjs/common';

interface TenantContext {
  account_id: string;
}

@Injectable()
export class TenantContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<TenantContext>();

  run(account_id: string, callback: () => void) {
    this.asyncLocalStorage.run({ account_id }, callback);
  }

  getContext(): TenantContext {
    return this.asyncLocalStorage.getStore();
  }
}
