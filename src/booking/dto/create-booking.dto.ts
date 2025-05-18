import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsPositive } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ type: 'integer', example: 1 })
  @Transform(({ value }) => parseInt(value as string))
  @IsInt()
  @IsPositive()
  user_id: number;

  @ApiProperty({ type: 'integer', example: 1 })
  @Transform(({ value }) => parseInt(value as string))
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
  @Transform(({ value }) => parseInt(value as string))
  @IsInt()
  total_price: number;
}
