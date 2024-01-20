import { Module } from '@nestjs/common';
import { InterviewListService } from './interview-list.service';
import { InterviewListController } from './interview-list.controller';

@Module({
  controllers: [InterviewListController],
  providers: [InterviewListService],
})
export class InterviewListModule {}
