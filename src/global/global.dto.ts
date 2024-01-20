import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @IsNumberString()
  @IsOptional()
  private page: string;

  @IsNumberString()
  @IsOptional()
  private limit: string;

  getPage() {
    return !!this.page ? Number(this.page) : 1;
  }

  getLimit() {
    return !!this.limit ? Number(this.limit) : 10;
  }
}
