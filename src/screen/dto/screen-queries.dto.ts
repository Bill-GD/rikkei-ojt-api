import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class ScreenQueries extends CommonQueries {
  @ApiPropertyOptional({
    enum: ['id', 'seat_capacity', 'theater_id', 'created_at', 'updated_at'],
  })
  @IsOptional()
  @IsEnum(['id', 'seat_capacity', 'theater_id', 'created_at', 'updated_at'])
  declare sort?: string;
}
