import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginBody } from './auth.dto';
import { MongoService } from 'src/global/mongo/mongo.service';
import { JwtService } from 'src/global/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private _mongoService: MongoService,
    private _jwtService: JwtService,
  ) {}
  async login(body: LoginBody) {
    try {
      const user = await this._mongoService.userModel.findOne({
        username: body.username,
      });
      if (!user) {
        throw new NotFoundException('username has not been found');
      }
      if (!user.isValidPassword(body.password)) {
        throw new UnauthorizedException('Incorrect password');
      }
      const payload = {
        userId: user.id,
        name: user.name,
      };
      return {
        accessToken: this._jwtService.createAccessToken(payload),
        refreshToken: this._jwtService.createRefreshToken(payload),
      };
    } catch (e) {
      throw e;
    }
  }

  async refreshToken(token: string) {
    try {
      const data = this._jwtService.verifyRefreshToken(token);
      if (!data) {
        throw new ForbiddenException();
      }
      const user = await this._mongoService.userModel.findById(
        data.payload['userId'],
      );
      const payload = {
        userId: user.id,
        name: user.name,
      };
      return {
        accessToken: this._jwtService.createAccessToken(payload),
        refreshToken: this._jwtService.createRefreshToken(payload),
      };
    } catch (e) {
      throw e;
    }
  }
}
