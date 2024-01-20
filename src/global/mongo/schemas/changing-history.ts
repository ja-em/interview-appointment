import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user';
import { InterviewList } from './interview-list';
export type IChangeData = Partial<Pick<InterviewList, 'title' | 'detail'>>;
@Schema({ timestamps: true, collection: 'changing-histories' })
export class ChangingHistories {
  @Prop({ type: String, ref: InterviewList.name })
  interviewList: string | InterviewList;

  @Prop({ type: Object })
  beforeChangeData: IChangeData;

  @Prop({ type: Object })
  afterChangeData: IChangeData;

  @Prop({ type: String, ref: User.name })
  createdBy: string | User;
}

export type ChangingHistoriesDocument = Document & ChangingHistories;
export const ChangingHistoriesSchema =
  SchemaFactory.createForClass(ChangingHistories);
