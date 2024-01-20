import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user';
import { InterviewList } from './interview-list';
import { SchemaNameEnum } from './schema-name';
import { Schema as MgSchema } from 'mongoose';

export type IChangeData = Partial<Pick<InterviewList, 'title' | 'detail'>>;
@Schema({ timestamps: true, collection: 'changing-histories' })
export class ChangingHistory {
  @Prop({ type: MgSchema.Types.ObjectId, ref: SchemaNameEnum.INTERVIEW_LIST })
  interviewList: string | InterviewList;

  @Prop({ type: Object })
  beforeChangeData: IChangeData;

  @Prop({ type: Object })
  afterChangeData: IChangeData;

  @Prop({ type: String, ref: User.name })
  createdBy: string | User;
}

export type ChangingHistoryDocument = Document & ChangingHistory;
export const ChangingHistorySchema =
  SchemaFactory.createForClass(ChangingHistory);
