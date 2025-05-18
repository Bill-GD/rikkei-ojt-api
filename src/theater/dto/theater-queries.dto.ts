import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class TheaterQueries extends CommonQueries {
  @ApiPropertyOptional({
    name: 'sort',
    enum: ['id', 'name', 'created_at', 'updated_at'],
    description: `Sort by one of the entity's properties`,
  })
  @IsOptional()
  @IsEnum(['id', 'name', 'created_at', 'updated_at'])
  declare sort?: string;

  @ApiPropertyOptional()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  location?: string;
}
