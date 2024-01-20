import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user';
import { InterviewList } from './interview-list';
import { SchemaNameEnum } from './schema-name';
import { HydratedDocument, Schema as MgSchema } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc.id;
      delete ret.__v;
      delete ret._id;
    },
  },
})
export class Comment {
  @Prop({ type: MgSchema.Types.ObjectId, ref: SchemaNameEnum.INTERVIEW_LIST })
  interviewList: string | InterviewList;

  @Prop()
  comment: string;

  @Prop({ type: String, ref: SchemaNameEnum.USER })
  createdBy: string | User;
}

export type CommentDocument = HydratedDocument<Comment>;
export const CommentSchema = SchemaFactory.createForClass(Comment);
