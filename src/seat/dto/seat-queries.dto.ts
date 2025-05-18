import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';
import SeatType from '../entities/seat-type.enum';

export class SeatQueries extends CommonQueries {
  @ApiPropertyOptional({
    name: 'sort',
    enum: [],
  })
  @IsOptional()
  @IsEnum([''])
  declare sort: string;

  @ApiPropertyOptional({ enum: SeatType })
  @IsOptional()
  @IsEnum(SeatType)
  type: SeatType;

  @ApiPropertyOptional({ type: 'boolean' })
  // @Transform
  @IsOptional()
  @IsBoolean()
  is_booked: boolean;
}
