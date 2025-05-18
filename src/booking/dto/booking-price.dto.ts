import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class BookingPriceDto {
  @ApiProperty({ type: 'array', example: [1, 2] })
  @IsArray()
  @IsNotEmpty()
  seat_ids: number[];

  @ApiProperty({ type: 'number', example: 1 })
  @Transform(({ value }) => parseInt(value as string))
  @IsInt()
  movie_id: number;
}
