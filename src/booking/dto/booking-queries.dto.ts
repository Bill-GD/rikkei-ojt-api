import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class BookingQueries extends CommonQueries {
  @ApiPropertyOptional({
    enum: ['id', 'total_seat', 'total_price_movie', 'created_at', 'updated_at'],
  })
  @IsOptional()
  @IsEnum(['id', 'total_seat', 'total_price_movie', 'created_at', 'updated_at'])
  declare sort?: string;

  @ApiPropertyOptional({ type: 'integer', example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsInt()
  @IsPositive()
  user_id?: number;

  @ApiPropertyOptional({ type: 'integer', example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsInt()
  @IsPositive()
  showtime_id?: number;
}
