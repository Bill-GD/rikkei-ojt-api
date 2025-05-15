import {
  ArrayNotEmpty, IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descriptions?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({ format: 'binary' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ format: 'binary' })
  @IsString()
  @IsOptional()
  trailer?: string;

  @ApiProperty({ enum: ['2D', '3D'] })
  @IsEnum(['2D', '3D'])
  type: string;

  @ApiProperty({
    type: 'integer',
    minimum: 1,
    description: 'The duration of the movie in minutes',
  })
  @IsInt()
  @Min(1)
  duration_min: number;

  @ApiProperty()
  @IsNotEmpty()
  release_date: Date;

  @ApiProperty({ type: 'array', example: [1] })
  // @Transform(({ value }) => {
  //   if (typeof value === 'string') {
  //     return value
  //       .split(',')
  //       .map((id) => parseInt(id, 10))
  //       .filter((id) => !isNaN(id));
  //   }
  //   return value;
  // })
  @ArrayNotEmpty()
  @IsArray()
  genre_ids: number[];
}
