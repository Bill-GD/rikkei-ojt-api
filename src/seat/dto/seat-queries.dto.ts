import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';
import SeatType from '../entities/seat-type.enum';

export class SeatQueries extends CommonQueries {
  @ApiPropertyOptional({ enum: ['id', 'created_at', 'updated_at'] })
  @IsOptional()
  @IsEnum(['id', 'created_at', 'updated_at'])
  declare sort?: string;

  @ApiPropertyOptional({ enum: SeatType })
  @IsOptional()
  @IsEnum(SeatType)
  type?: SeatType;

  @ApiPropertyOptional({ type: 'boolean' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  @IsBoolean()
  is_booked?: boolean;

  @ApiPropertyOptional({ type: 'number', example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsInt()
  screen_id?: number;

  @ApiPropertyOptional({ example: 'A1' })
  @IsOptional()
  @IsString()
  seat_number?: string;
}
