import { IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/global/global.dto';
import { InterviewList } from 'src/global/mongo/schemas/interview-list';

export class CreateInterviewBody implements Partial<InterviewList> {
  @IsString()
  title?: string;
  @IsString()
  detail?: string;
}

export class GetInterviewQuery extends PaginationQueryDto {}
