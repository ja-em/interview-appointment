import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './global/global.module';
import { AuthModule } from './auth/auth.module';
import { InterviewListModule } from './interview-list/interview-list.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), GlobalModule, AuthModule, InterviewListModule],
})
export class AppModule {}
