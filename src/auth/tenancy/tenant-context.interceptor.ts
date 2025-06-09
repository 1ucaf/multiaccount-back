import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from './tenant-context.service';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  constructor(private readonly tenantContext: TenantContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const account_id = req.user?.account_id;

    if (!account_id) {
      return next.handle();
    }

    return new Observable((observer) => {
      this.tenantContext.run(account_id, () => {
        next
          .handle()
          .subscribe({
            next: (val) => observer.next(val),
            error: (err) => observer.error(err),
            complete: () => observer.complete(),
          });
      });
    });
  }
}
