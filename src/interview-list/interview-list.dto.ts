import { IsMongoId, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/global/global.dto';
import { InterviewList } from 'src/global/mongo/schemas/interview-list';

export class CreateInterviewBody implements Partial<InterviewList> {
  @IsString()
  title?: string;
  @IsString()
  detail?: string;
}

export class GetInterviewQuery extends PaginationQueryDto {}

export class GetInterviewByIdParam {
  @IsMongoId()
  interviewId: string;
}

export class AddCommentToInterviewBody {
  @IsString()
  comment: string;
}

export class UpdateCommentParam extends GetInterviewByIdParam {
  @IsMongoId()
  commentId: string;
}
