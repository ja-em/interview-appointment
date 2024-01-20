import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICurrentUser } from 'src/global/global.interface';
import {
  CreateInterviewBody,
  GetInterviewQuery,
  UpdateCommentParam,
  UpdateInterviewBody,
} from './interview-list.dto';
import { MongoService } from 'src/global/mongo/mongo.service';
import {
  InterviewList,
  InterviewStatusEnum,
} from 'src/global/mongo/schemas/interview-list';
import { CommentDocument } from 'src/global/mongo/schemas/comment';
import { IChangeData } from 'src/global/mongo/schemas/changing-history';

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
            status: { $ne: InterviewStatusEnum.DONE },
          })
          .sort({ createdAt: 'asc' })
          .skip((query.getPage() - 1) * query.getLimit())
          .limit(query.getLimit())
          .populate({ path: 'createdBy', select: 'name' }),
        this._mongoService.interviewListModel.countDocuments({
          status: { $ne: InterviewStatusEnum.DONE },
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

  async getInterviewById(id: string, isPopulate = true) {
    try {
      const data = await this._mongoService.interviewListModel
        .findById(id)
        .populate(
          isPopulate
            ? [
                { path: 'createdBy', select: 'name' },
                {
                  path: 'comments',
                  select: '-interviewList',
                  populate: {
                    path: 'createdBy',
                    select: 'name',
                  },
                  options: { sort: { updatedAt: -1, createdAt: -1 } },
                },
                {
                  path: 'changingHistories',
                  select: '-updatedAt -interviewList',
                  populate: {
                    path: 'createdBy',
                    select: 'name',
                  },
                  options: { sort: { createdAt: -1 } },
                },
              ]
            : [],
        );
      if (!data) {
        throw new NotFoundException('this interview id is not existed');
      }
      return data;
    } catch (e) {
      throw e;
    }
  }

  async addCommentToInterview(
    userId: string,
    interviewId: string,
    comment: string,
  ) {
    try {
      const data = await this.getInterviewById(interviewId);
      const commentInsert = await this._mongoService.commentModel.create({
        interviewList: data.id,
        comment,
        createdBy: userId,
      });
      data.comments.push(commentInsert.id);
      await data.save();
      return 'OK';
    } catch (e) {
      throw e;
    }
  }

  private async _validateComment(
    commentId: string,
    interviewId: string,
    currentUserId: string,
  ): Promise<CommentDocument> {
    try {
      const data = await this._mongoService.commentModel.findById(commentId);
      if (!data) {
        throw new NotFoundException('this comment id is not existed');
      }
      const isYourComment =
        (data.createdBy as string).localeCompare(currentUserId, undefined, {
          sensitivity: 'accent',
        }) === 0;
      const errors = [];

      if (!isYourComment) {
        errors.push('This comment is not yours');
      }
      const isCommentInInterview =
        (data.interviewList as string)
          .toString()
          .localeCompare(interviewId, undefined, {
            sensitivity: 'accent',
          }) === 0;

      if (!isCommentInInterview) {
        errors.push('This comment is not in this interview');
      }
      if (errors.length !== 0) {
        throw new BadRequestException(errors);
      }
      return data;
    } catch (e) {
      throw e;
    }
  }

  async updateComment(
    currentUser: string,
    param: UpdateCommentParam,
    newComment: string,
  ) {
    try {
      const findComment = await this._validateComment(
        param.commentId,
        param.interviewId,
        currentUser,
      );
      findComment.comment = newComment;
      await findComment.save();
      return 'OK';
    } catch (e) {
      throw e;
    }
  }

  async deleteComment(currentUser: string, param: UpdateCommentParam) {
    try {
      const [_, findInterview] = await Promise.all([
        this._validateComment(param.commentId, param.interviewId, currentUser),
        this.getInterviewById(param.interviewId, false),
      ]);

      findInterview.comments = findInterview.comments.filter((e) => {
        return (
          e.toString().localeCompare(param.commentId, undefined, {
            sensitivity: 'accent',
          }) !== 0
        );
      });

      await Promise.all([
        this._mongoService.commentModel.deleteOne({ _id: param.commentId }),
        findInterview.save(),
      ]);
      return 'OK';
    } catch (e) {
      throw e;
    }
  }

  private _compareValue(
    interviewDetail: InterviewList,
    body: UpdateInterviewBody,
  ): Array<keyof IChangeData> {
    const keyChange: Array<keyof IChangeData> = [];
    const isChange = (oldValue: string, newValue: string) => {
      return (
        oldValue.localeCompare(newValue, undefined, {
          sensitivity: 'accent',
        }) !== 0
      );
    };
    if (isChange(interviewDetail.title, body.title)) {
      keyChange.push('title');
    }
    if (isChange(interviewDetail.detail, body.detail)) {
      keyChange.push('detail');
    }
    if (isChange(interviewDetail.status, body.status)) {
      keyChange.push('status');
    }
    return keyChange;
  }

  async updateInterviewById(
    interviewId: string,
    body: UpdateInterviewBody,
    userId: string,
  ) {
    try {
      const findInterview = await this.getInterviewById(interviewId);
      const keyChange = this._compareValue(findInterview, body);
      if (keyChange.length === 0) {
        return 'OK';
      }

      const { newValue, oldValue } = keyChange.reduce<{
        oldValue: IChangeData;
        newValue: IChangeData;
      }>(
        (a, c) => {
          findInterview[c as string] = body[c];

          Object.assign(a.oldValue, { [c]: findInterview[c] });
          Object.assign(a.newValue, { [c]: body[c] });
          return a;
        },
        { oldValue: {}, newValue: {} },
      );
      const newLog = await this._mongoService.changingHistoryModel.create({
        beforeChangeData: oldValue,
        afterChangeData: newValue,
        interviewList: findInterview.id,
        createdBy: userId,
      });

      findInterview.changingHistories.push(newLog.id);
      await findInterview.save();

      return 'OK';
    } catch (e) {
      throw e;
    }
  }
}
