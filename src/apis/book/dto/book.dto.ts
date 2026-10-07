import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class BookListingDto extends PaginationDto {
  @IsString()
  @IsOptional()
  search?: string;
}
