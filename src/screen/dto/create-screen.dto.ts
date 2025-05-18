import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateScreenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value as string))
  @IsNumber()
  seat_capacity: number;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value as string))
  @IsNumber()
  theater_id: number;
}
