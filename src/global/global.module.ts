import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoService } from './mongo/mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './mongo/schemas/user';
import { JwtService } from './jwt/jwt.service';

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
  ],
  providers: [MongoService, JwtService],
  exports: [MongoService, JwtService],
})
export class GlobalModule {}
