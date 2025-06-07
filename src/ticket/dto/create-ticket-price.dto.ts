import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  Min,
  IsNotEmpty,
  IsBoolean,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SeatType, MovieType } from '../entities/ticket-price.entity';

export class CreateTicketPriceDto {
  @ApiProperty({ enum: SeatType, type: 'string' })
  @IsEnum(SeatType)
  type_seat: SeatType;

  @ApiProperty({ enum: MovieType, type: 'string' })
  @IsEnum(MovieType)
  type_movie: MovieType;

  @ApiProperty({ type: 'number' })
  @Transform(({ value }) => parseInt(value as string))
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'false - ngày thường; true - cuối tuần/ngày lễ',
    type: 'boolean',
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  day_type: boolean;

  @ApiProperty({ example: '08:00:00' })
  @IsNotEmpty()
  @IsString()
  start_time: string;

  @ApiProperty({ example: '12:00:00' })
  @IsNotEmpty()
  @IsString()
  end_time: string;
}
