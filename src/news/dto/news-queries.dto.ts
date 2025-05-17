import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class NewsQueries extends CommonQueries {
  @ApiProperty({ required: false, type: 'integer' })
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
