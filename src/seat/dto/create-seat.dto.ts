import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import SeatType from '../entities/seat-type.enum';

export class CreateSeatDto {
  @ApiProperty({ example: 'A1' })
  @IsString()
  @IsNotEmpty()
  seat_number: string;

  @ApiProperty({ enum: SeatType })
  @IsEnum(SeatType)
  type: SeatType;

  is_booked: boolean;

  screen_id: number;
}
