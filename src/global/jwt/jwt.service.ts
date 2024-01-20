import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Jwt, decode, sign, verify } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly _AK: string;
  private readonly _RK: string;
  private readonly _AT_ttl = '20m';
  private readonly _RT_ttl = '2d';
  constructor(private _config: ConfigService) {
    this._AK = _config.get('ACCESS_KEY');
    this._RK = _config.get('REFRESH_KEY');
  }

  public createAccessToken(data: any): string {
    return sign(data, this._AK, { expiresIn: this._AT_ttl });
  }

  public verifyAccessToken(token: string): Jwt {
    try {
      return verify(token, this._AK, {
        ignoreExpiration: false,
        complete: true,
      });
    } catch (e) {
      return null;
    }
  }

  public createRefreshToken(data: object): string {
    return sign(data, this._RK, { expiresIn: this._RT_ttl });
  }

  public verifyRefreshToken(token: string): Jwt {
    try {
      return verify(token, this._RK, {
        ignoreExpiration: false,
        complete: true,
      });
    } catch (e) {
      return null;
    }
  }

  decode(token: string): Jwt {
    return decode(token, { json: true, complete: true });
  }
}
