import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, IsPositive } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ type: 'integer', example: 1 })
  @IsInt()
  @IsPositive()
  user_id: number;

  @ApiProperty({ type: 'integer', example: 1 })
  @IsInt()
  @IsPositive()
  showtime_id: number;

  @ApiProperty({ type: 'array', example: [1, 2] })
  @IsArray()
  @ArrayNotEmpty()
  seat_ids: number[];

  movie_id: number;

  @ApiProperty({
    type: 'integer',
    description:
      'The calculated total price of the booking, ' +
      'should use the `/price` POST request.',
  })
  @IsInt()
  total_price: number;
}
