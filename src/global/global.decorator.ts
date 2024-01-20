import {
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from '@nestjs/common';
import { ICurrentUser } from './global.interface';
import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from './mongo/schemas/user';

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

export const USER_ROLES_KEY = 'user-roles';
export const Roles = (...roles: UserRoleEnum[]) =>
  SetMetadata(USER_ROLES_KEY, roles);
