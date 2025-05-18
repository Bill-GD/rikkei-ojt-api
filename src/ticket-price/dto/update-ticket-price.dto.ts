import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  IsBoolean,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { SeatType, MovieType } from '../entities/ticket-price.entity';
import { CreateTicketPriceDto } from './create-ticket-price.dto';

export class UpdateTicketPriceDto extends PartialType(CreateTicketPriceDto) {
  @ApiPropertyOptional({ enum: SeatType })
  @IsOptional()
  @IsEnum(SeatType)
  type_seat?: SeatType;

  @ApiPropertyOptional({ enum: MovieType })
  @IsOptional()
  @IsEnum(MovieType)
  type_movie?: MovieType;

  @ApiPropertyOptional({ type: 'integer', example: 100000 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    type: 'boolean',
    description: 'false - ngày thường; true - cuối tuần/ngày lễ',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  day_type?: boolean;

  @ApiPropertyOptional({ example: '10:00:00' })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiPropertyOptional({ example: '14:00:00' })
  @IsOptional()
  @IsString()
  end_time?: string;
}
