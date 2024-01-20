import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserRole } from './schemas/user';
import { Model } from 'mongoose';

@Injectable()
export class MongoService {
  constructor(@InjectModel(User.name) public userModel: Model<UserDocument>) {
    this.initUser();
  }
  async initUser() {
    try {
      const totalUser = 10;
      const count = await this.userModel.countDocuments();
      if (count === totalUser) {
        return 'OK';
      }
      const users: User[] = new Array(totalUser).fill('').map((_, i) => {
        const user = new User();
        user.name = `Robin hood ${i + 1}`;
        user.username = user.name.replace(/ /g, '').toLowerCase();
        user.role = i % 2 === 0 ? UserRole.ADMIN : UserRole.STAFF;
        user.setPassword(user.username);
        return user;
      });
      await this.userModel.insertMany(users);
    } catch (e) {
      Logger.error(e, MongoService.name);
    }
  }
}
