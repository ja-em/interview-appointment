import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserRoleEnum } from './schemas/user';
import { Model } from 'mongoose';
import { InterviewListDocument } from './schemas/interview-list';
import { CommentDocument } from './schemas/comment';
import { ChangingHistoryDocument } from './schemas/changing-history';
import { SchemaNameEnum } from './schemas/schema-name';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel(SchemaNameEnum.USER) public userModel: Model<UserDocument>,
    @InjectModel(SchemaNameEnum.INTERVIEW_LIST)
    public interviewListModel: Model<InterviewListDocument>,
    @InjectModel(SchemaNameEnum.COMMENT)
    public commentModel: Model<CommentDocument>,
    @InjectModel(SchemaNameEnum.CHANGING_HISTORY)
    public changingHistoryModel: Model<ChangingHistoryDocument>,
  ) {
    this._initUser();
  }
  private async _initUser() {
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
        user.role = i % 2 === 0 ? UserRoleEnum.ADMIN : UserRoleEnum.STAFF;
        user.setPassword(user.username);
        return user;
      });
      await this.userModel.insertMany(users);
    } catch (e) {
      Logger.error(e, MongoService.name);
    }
  }
}
