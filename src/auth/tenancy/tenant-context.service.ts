import { AsyncLocalStorage } from 'async_hooks';
import { Injectable } from '@nestjs/common';

interface TenantContext {
  accountId: string;
}

@Injectable()
export class TenantContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<TenantContext>();

  run(accountId: string, callback: () => void) {
    this.asyncLocalStorage.run({ accountId }, callback);
  }

  getContext(): TenantContext {
    return this.asyncLocalStorage.getStore();
  }
}
