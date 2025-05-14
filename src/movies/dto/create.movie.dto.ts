import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  descriptions?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  trailer?: string;

  @ApiProperty({ enum: ['2D', '3D'] })
  @IsEnum(['2D', '3D'])
  type: '2D' | '3D';

  @ApiProperty({ type: 'integer', minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  duration_min: number;

  @ApiProperty()
  @IsNotEmpty()
  release_date: Date;
}
