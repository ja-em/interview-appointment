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
} from './interview-list.dto';
import { MongoService } from 'src/global/mongo/mongo.service';
import { InterviewStatusEnum } from 'src/global/mongo/schemas/interview-list';
import { CommentDocument } from 'src/global/mongo/schemas/comment';

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
          .populate({ path: 'createdBy', select: 'name' }),
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
                  select: '-updatedAt -interviewList',
                  populate: {
                    path: 'createdBy',
                    select: 'name',
                  },
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
}
