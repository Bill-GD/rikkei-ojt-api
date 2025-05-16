import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class ScreenQueries extends CommonQueries {
  @ApiPropertyOptional({
    name: 'sort',
    enum: ['id', 'seat_capacity', 'theater_id', 'created_at', 'updated_at'],
    description: `Sort by one of the entity's properties`,
  })
  @IsOptional()
  @IsEnum(['id', 'seat_capacity', 'theater_id', 'created_at', 'updated_at'])
  declare sort: string;
}
