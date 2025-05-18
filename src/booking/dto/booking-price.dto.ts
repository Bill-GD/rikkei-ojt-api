import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class BookingPriceDto {
  @ApiProperty({ type: 'array', example: [1, 2] })
  @Transform(({ value }) =>
    (value as string)
      .split(',')
      .map((e) => e.trim())
      .map((e) => parseInt(e, 10))
      .filter((e) => !isNaN(e)),
  )
  @IsArray()
  @IsNotEmpty()
  seat_ids: number[];

  @ApiProperty({ type: 'number', example: 1 })
  @Transform(({ value }) => parseInt(value as string))
  @IsInt()
  movie_id: number;
}
