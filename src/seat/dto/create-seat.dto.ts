import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum SeatType {
  STANDARD = 'STANDARD',
  VIP = 'VIP',
  SWEETBOX = 'SWEETBOX',
}

export class CreateSeatDto {
  @IsNumber()
  screen_id: number;

  @IsString()
  @IsNotEmpty()
  seat_number: string;

  is_booked?: boolean;

  @IsEnum(SeatType)
  type: SeatType;
}
