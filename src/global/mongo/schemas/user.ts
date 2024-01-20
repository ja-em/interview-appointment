import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ enum: UserRole })
  role: UserRole;

  isValidPassword(plain: string): boolean {
    return bcrypt.compareSync(plain, this.password);
  }

  setPassword(plainPassword: string): void {
    this.password = bcrypt.hashSync(plainPassword, bcrypt.genSaltSync());
  }
}

export type UserDocument = Document & User;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.isValidPassword = function (plain: string): boolean {
  return bcrypt.compareSync(plain, this.password);
};

UserSchema.methods.setPassword = function (plainPassword: string): void {
  this.password = bcrypt.hashSync(plainPassword, bcrypt.genSaltSync());
};
