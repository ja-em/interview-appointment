import { UserRole } from './mongo/schemas/user';

export interface ICurrentUser {
  userId: string;
  name: string;
  username: string;
  role: UserRole;
}
