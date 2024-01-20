import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user';
import { InterviewList } from './interview-list';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, ref: InterviewList.name })
  interviewList: string | InterviewList;

  @Prop()
  comment: string;

  @Prop({ type: String, ref: User.name })
  createdBy: string | User;
}

export type CommentDocument = Document & Comment;
export const CommentSchema = SchemaFactory.createForClass(Comment);
