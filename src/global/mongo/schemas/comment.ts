import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user';
import { InterviewList } from './interview-list';
import { SchemaNameEnum } from './schema-name';
import { Schema as MgSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: MgSchema.Types.ObjectId, ref: SchemaNameEnum.INTERVIEW_LIST })
  interviewList: string | InterviewList;

  @Prop()
  comment: string;

  @Prop({ type: String, ref: User.name })
  createdBy: string | User;
}

export type CommentDocument = Document & Comment;
export const CommentSchema = SchemaFactory.createForClass(Comment);
