import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRoleEnum {
  ADMIN = 'admin',
  STAFF = 'staff',
}

@Schema({
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc.id;
      delete ret.__v;
      delete ret._id;
    },
  },
})
export class User {
  @Prop()
  name: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ enum: UserRoleEnum })
  role: UserRoleEnum;

  isValidPassword(plain: string): boolean {
    return bcrypt.compareSync(plain, this.password);
  }

  setPassword(plainPassword: string): void {
    this.password = bcrypt.hashSync(plainPassword, bcrypt.genSaltSync());
  }
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.isValidPassword = function (plain: string): boolean {
  return bcrypt.compareSync(plain, this.password);
};

UserSchema.methods.setPassword = function (plainPassword: string): void {
  this.password = bcrypt.hashSync(plainPassword, bcrypt.genSaltSync());
};
