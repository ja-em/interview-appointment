import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InterviewListService } from './interview-list.service';
import { AccessTokenGuard } from 'src/global/global.guard';
import {
  AddCommentToInterviewBody,
  CreateInterviewBody,
  GetInterviewByIdParam,
  GetInterviewQuery,
  UpdateCommentParam,
  UpdateInterviewBody,
} from './interview-list.dto';
import { CurrentUser } from 'src/global/global.decorator';
import { ICurrentUser } from 'src/global/global.interface';

@UseGuards(AccessTokenGuard)
@Controller('interview-list')
export class InterviewListController {
  constructor(private readonly _interviewListService: InterviewListService) {}
  @Post()
  createInterview(
    @Body() body: CreateInterviewBody,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this._interviewListService.createInterview(body, user);
  }

  @Get()
  getInterview(@Query() query: GetInterviewQuery) {
    return this._interviewListService.getInterview(query);
  }

  @Get(':interviewId')
  getInterviewById(@Param() param: GetInterviewByIdParam) {
    return this._interviewListService.getInterviewById(param.interviewId);
  }

  @Patch(':interviewId')
  updateInterviewById(
    @Param() param: GetInterviewByIdParam,
    @Body() body: UpdateInterviewBody,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this._interviewListService.updateInterviewById(
      param.interviewId,
      body,
      user.userId,
    );
  }

  @Post(':interviewId/comment')
  addCommentToInterview(
    @CurrentUser() user: ICurrentUser,
    @Param() param: GetInterviewByIdParam,
    @Body() body: AddCommentToInterviewBody,
  ) {
    return this._interviewListService.addCommentToInterview(
      user.userId,
      param.interviewId,
      body.comment,
    );
  }

  @Patch(':interviewId/comment/:commentId')
  updateComment(
    @CurrentUser() user: ICurrentUser,
    @Param() param: UpdateCommentParam,
    @Body() body: AddCommentToInterviewBody,
  ) {
    return this._interviewListService.updateComment(
      user.userId,
      param,
      body.comment,
    );
  }

  @Delete(':interviewId/comment/:commentId')
  deleteComment(
    @CurrentUser() user: ICurrentUser,
    @Param() param: UpdateCommentParam,
  ) {
    return this._interviewListService.deleteComment(user.userId, param);
  }
}
