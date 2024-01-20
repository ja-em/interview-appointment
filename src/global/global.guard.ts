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
