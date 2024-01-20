import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBody } from './auth.dto';
import { AccessTokenGuard } from 'src/global/global.guard';
import { CurrentUser } from 'src/global/global.decorator';
import { ICurrentUser } from 'src/global/global.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}
  @Post('login')
  login(@Body() body: LoginBody) {
    return this._authService.login(body);
  }

  @Get('refresh-token')
  refreshToken(@Headers('Authorization') bearerTk: string) {
    return this._authService.refreshToken(bearerTk?.split(' ')[1]);
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  me(@CurrentUser() user: ICurrentUser) {
    return user;
  }
}
