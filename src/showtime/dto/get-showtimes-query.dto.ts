import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommonQueries } from '../../common/model/common-queries';

export class GetShowtimesQueryDto extends CommonQueries {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    name: 'sort',
    enum: [
      'id',
      'screen_id',
      'movie_id',
      'start_time',
      'end_time',
      'created_at',
      'updated_at',
    ],
    description: `Sort by one of the entity's properties`,
  })
  @IsOptional()
  @IsEnum([
    'id',
    'screen_id',
    'movie_id',
    'start_time',
    'end_time',
    'created_at',
    'updated_at',
  ])
  declare sort: string;
}
