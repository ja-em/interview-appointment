import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

export class GlobalInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const req = ctx.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => {
        if (!data?.lists || (data.lists && !Array.isArray(data.lists))) {
          return { data };
        }

        return {
          data: data.lists,
          pagination: {
            page: +(req.query?.page ?? 1),
            pageSize: +(req.query?.limit ?? 10),
            pageCount: data.lists.length,
            total: data['count'] ?? 0,
          },
        };
      }),
      catchError((e) => {
        if (e.status) {
          return throwError(() => e);
        }
        if (Array.isArray(e)) {
          return throwError(() => new BadRequestException(e));
        }
        if (e.message) {
          return throwError(() => new InternalServerErrorException(e.message));
        }
        Logger.error(e, GlobalInterceptor.name);
        return throwError(() => new InternalServerErrorException(e));
      }),
    );
  }
}
