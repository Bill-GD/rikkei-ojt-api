import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class CommonQueries {
  @ApiProperty({ required: false, type: 'integer' })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  page: number;

  @ApiProperty({ required: false, type: 'integer' })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  limit: number;

  @ApiProperty({
    name: 'sort',
    required: false,
    type: 'string',
    description: 'Sort by one of the entity properties',
  })
  @IsOptional()
  sort: string;

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order: string;
}
