import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class MovieQueries extends CommonQueries {
  @ApiPropertyOptional({
    name: 'sort',
    enum: ['id', 'duration_min', 'release_date'],
    description: `Sort by one of the entity's properties`,
  })
  @IsOptional()
  @IsEnum(['id', 'duration_min', 'release_date'])
  declare sort?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  author?: string;
}
