import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class BookingQueries extends CommonQueries {
  @ApiPropertyOptional({
    name: 'sort',
    enum: ['id', 'total_seat', 'total_price_movie', 'created_at', 'updated_at'],
    description: `Sort by one of the entity's properties`,
  })
  @IsOptional()
  @IsEnum(['id', 'total_seat', 'total_price_movie', 'created_at', 'updated_at'])
  declare sort: string;

  @ApiPropertyOptional({ type: 'integer' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  user_id: number;

  @ApiPropertyOptional({ type: 'integer' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  showtime_id: number;
}
