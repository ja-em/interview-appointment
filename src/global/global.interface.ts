import { UserRoleEnum } from './mongo/schemas/user';

export interface ICurrentUser {
  userId: string;
  name: string;
  username: string;
  role: UserRoleEnum;
}
