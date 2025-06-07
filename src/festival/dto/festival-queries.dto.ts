import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class FestivalQueries extends CommonQueries {
  @ApiPropertyOptional({
    type: 'string',
    description: 'Search for festival with title containing this',
    example: 'Kỷ niệm',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ enum: ['id', 'start_time', 'end_time'] })
  @IsOptional()
  @IsEnum(['id', 'start_time', 'end_time'])
  declare sort?: string;
}
