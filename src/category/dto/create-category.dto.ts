import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsInt,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug?: string;

  @ApiProperty({
    nullable: true,
    description: 'Parent category ID can be an integer or null',
  })
  @IsInt({ message: 'Parent category ID must be an integer' })
  @IsOptional()
  parent_category_id?: number | null;
}
