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
    req.query;
    return next.handle().pipe(
      map((data) => {
        if (!Array.isArray(data)) return { data };
        return {
          data,
          pagination: {
            page: 0,
            pageSize: 0,
            pageCount: data.length,
            total: 0,
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
