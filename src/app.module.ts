import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './global/global.module';
import { AuthModule } from './auth/auth.module';
import { InterviewListModule } from './interview-list/interview-list.module';
import { AppController } from './app.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GlobalModule,
    AuthModule,
    InterviewListModule,
    ThrottlerModule.forRoot({
      //*limit 10 request in 1 minute
      throttlers: [{ limit: 10, ttl: 60000 }],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
