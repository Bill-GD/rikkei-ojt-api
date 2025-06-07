import { Transform } from 'class-transformer';
import { IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShowtimeDto {
  @ApiProperty({ example: 1 })
  @Transform(({ value }) => parseInt(value as string))
  @IsInt()
  screen_id: number;

  @ApiProperty({ example: 1 })
  @Transform(({ value }) => parseInt(value as string))
  @IsInt()
  movie_id: number;

  @ApiProperty({ example: '2025-05-15 14:00:00' })
  @IsDateString()
  start_time: Date;

  @ApiProperty({ example: '2025-05-15 16:00:00' })
  @IsDateString()
  end_time: Date;
}
