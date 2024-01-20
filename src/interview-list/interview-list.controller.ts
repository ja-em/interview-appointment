import { Controller, UseGuards } from '@nestjs/common';
import { InterviewListService } from './interview-list.service';
import { AccessTokenGuard } from 'src/global/global.guard';

@UseGuards(AccessTokenGuard)
@Controller('interview-list')
export class InterviewListController {
  constructor(private readonly interviewListService: InterviewListService) {}
}
