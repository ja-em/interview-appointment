import { Global, Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongoService } from './mongo/mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './mongo/schemas/user';

const mongoSchema = [
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
];

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
        dbName: configService.get('MONGO_DB'),
      }),
    }),
    ...mongoSchema,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        global: true,
      }),
    }),
  ],
  providers: [MongoService],
  exports: [MongoService],
})
export class GlobalModule {}
