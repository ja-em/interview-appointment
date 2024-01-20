import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user';
import { ChangingHistory } from './changing-history';
import { Comment } from './comment';
import { SchemaNameEnum } from './schema-name';
import { Schema as MgSchema } from 'mongoose';

export enum InterviewStatusEnum {
  TO_DO = 'to-do',
  PROGRESS = 'progress',
  DONE = 'DONE',
}
@Schema({ timestamps: true, collection: 'interview-lists' })
export class InterviewList {
  @Prop()
  title: string;

  @Prop()
  detail: string;

  @Prop({
    type: [MgSchema.Types.ObjectId],
    ref: SchemaNameEnum.COMMENT,
    default: [],
  })
  comments: Array<string | Comment>;

  @Prop({
    type: [MgSchema.Types.ObjectId],
    ref: SchemaNameEnum.CHANGING_HISTORY,
    default: [],
  })
  changingHistories: Array<string | ChangingHistory>;

  @Prop({ type: MgSchema.Types.ObjectId, ref: SchemaNameEnum.USER })
  createdBy: string | User;

  @Prop({ enum: InterviewStatusEnum, default: InterviewStatusEnum.TO_DO })
  status: InterviewStatusEnum;
}

export type InterviewListDocument = Document & InterviewList;
export const InterviewListSchema = SchemaFactory.createForClass(InterviewList);
