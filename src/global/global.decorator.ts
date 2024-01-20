import {
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from '@nestjs/common';
import { ICurrentUser } from './global.interface';

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): ICurrentUser => {
    try {
      const request = ctx.switchToHttp().getRequest();
      return <ICurrentUser>request.user;
    } catch (e) {
      throw new ForbiddenException('H');
    }
  },
);
