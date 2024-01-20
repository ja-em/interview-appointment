import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user';

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

  @Prop()
  comments: Array<string>;

  @Prop()
  changingHistories: Array<string>;

  @Prop({ type: String, ref: User.name })
  createdBy: string | User;

  @Prop({ enum: InterviewStatusEnum })
  status: InterviewStatusEnum;
}

export type InterviewListDocument = Document & InterviewList;
export const InterviewListSchema = SchemaFactory.createForClass(InterviewList);
