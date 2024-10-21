import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';
import { MinValueString } from 'src/decorator/validator/min-value-string.decorator';

export class GetCategoriesDto {
  @IsOptional()
  @IsNumberString()
  @MinValueString(1)
  page?: number = 1;

  @IsOptional()
  @IsNumberString()
  @MinValueString(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(['name'])
  orderBy?: string = 'name';

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  orderDirection?: 'ASC' | 'DESC' = 'ASC';
}
