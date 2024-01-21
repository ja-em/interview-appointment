import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { JwtService } from './jwt/jwt.service';
import { Request } from 'express';
import { MongoService } from './mongo/mongo.service';
import { ICurrentUser } from './global.interface';
import { Reflector } from '@nestjs/core';
import { USER_ROLES_KEY } from './global.decorator';
import { UserRoleEnum } from './mongo/schemas/user';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private _jwtService: JwtService,
    private _mongoService: MongoService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest() as Request;
      const token = request.headers?.authorization?.split(' ')[1];
      const data = this._jwtService.verifyAccessToken(token?.trim());
      if (!data) {
        return false;
      }
      if(!data?.payload['userId']){
        return false
      }
      const { id, name, username, role } =
        await this._mongoService.userModel.findById(data.payload['userId']);
      const currentUser: ICurrentUser = {
        userId: id,
        name,
        username,
        role,
      };
      request['user'] = currentUser;
      return true;
    } catch (e) {
      Logger.error(e, AccessTokenGuard.name);
      return false;
    }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      USER_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const user: ICurrentUser = context.switchToHttp().getRequest().user;
    return requiredRoles.includes(user.role);
  }
}
