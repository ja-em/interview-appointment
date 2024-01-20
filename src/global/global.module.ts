import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoService } from './mongo/mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './mongo/schemas/user';
import { JwtService } from './jwt/jwt.service';
import { InterviewListSchema } from './mongo/schemas/interview-list';
import { CommentSchema } from './mongo/schemas/comment';
import { ChangingHistorySchema } from './mongo/schemas/changing-history';
import { SchemaNameEnum } from './mongo/schemas/schema-name';

const mongoSchema = [
  MongooseModule.forFeature([
    { name: SchemaNameEnum.USER, schema: UserSchema },
  ]),
  MongooseModule.forFeature([
    { name: SchemaNameEnum.INTERVIEW_LIST, schema: InterviewListSchema },
  ]),
  MongooseModule.forFeature([
    { name: SchemaNameEnum.COMMENT, schema: CommentSchema },
  ]),
  MongooseModule.forFeature([
    { name: SchemaNameEnum.CHANGING_HISTORY, schema: ChangingHistorySchema },
  ]),
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
