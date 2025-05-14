import { IsEnum, IsNumber, Min, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SeatType, MovieType } from '../entities/ticket-price.entity';

export class CreateTicketPriceDto {
  @ApiProperty({ enum: SeatType, type: String })
  @IsEnum(SeatType)
  type_seat: SeatType;

  @ApiProperty({ enum: MovieType, type: String })
  @IsEnum(MovieType)
  type_movie: MovieType;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'false - ngày thường; true - cuối tuần/ngày lễ',
    type: Boolean,
  })
  @IsBoolean()
  day_type: boolean;

  @ApiProperty({ example: '08:00:00', type: String })
  @IsNotEmpty()
  start_time: string;

  @ApiProperty({ example: '12:00:00', type: String })
  @IsNotEmpty()
  end_time: string;
}
