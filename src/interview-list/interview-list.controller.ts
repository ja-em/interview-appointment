import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { InterviewListService } from './interview-list.service';
import { AccessTokenGuard } from 'src/global/global.guard';
import { CreateInterviewBody, GetInterviewQuery } from './interview-list.dto';
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
}
