import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class IdValidateDto {
  @IsNotEmpty()
  @IsUUID('all')
  id: string;
}

export class IntIdValidateDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  id: number;
}
