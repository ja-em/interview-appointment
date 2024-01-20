import { Injectable } from '@nestjs/common';
import { ICurrentUser } from 'src/global/global.interface';
import { CreateInterviewBody, GetInterviewQuery } from './interview-list.dto';
import { MongoService } from 'src/global/mongo/mongo.service';
import { InterviewStatusEnum } from 'src/global/mongo/schemas/interview-list';

@Injectable()
export class InterviewListService {
  constructor(private _mongoService: MongoService) {}
  async createInterview(body: CreateInterviewBody, user: ICurrentUser) {
    try {
      const data = await this._mongoService.interviewListModel.create({
        ...body,
        createdBy: user.userId,
      });
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getInterview(query: GetInterviewQuery) {
    try {
      const [lists, count] = await Promise.all([
        this._mongoService.interviewListModel
          .find({
            status: InterviewStatusEnum.TO_DO,
          })
          .sort({ createdAt: 'asc' })
          .skip((query.getPage() - 1) * query.getLimit())
          .limit(query.getLimit())
          .populate('createdBy'),
        this._mongoService.interviewListModel.countDocuments({
          status: InterviewStatusEnum.TO_DO,
        }),
      ]);
      return {
        lists,
        count,
      };
    } catch (e) {
      throw e;
    }
  }
}
