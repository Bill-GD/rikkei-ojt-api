import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class NewsQuery extends CommonQueries {
  @ApiProperty({ required: false, type: 'integer' })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  @IsOptional()
  festival_id: number;

  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Search for news with title containing this',
  })
  @IsString()
  @IsOptional()
  title: string;
}
