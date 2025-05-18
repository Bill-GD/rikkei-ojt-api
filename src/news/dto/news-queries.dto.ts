import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class NewsQueries extends CommonQueries {
  @ApiPropertyOptional({ type: 'integer' })
  @IsInt()
  @IsPositive()
  @IsOptional()
  festival_id?: number;

  @ApiPropertyOptional({
    description: 'Search for news with title containing this',
    example: 'Thông báo',
  })
  @IsString()
  @IsOptional()
  title?: string;
}
