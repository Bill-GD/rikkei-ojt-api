import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';

export class CreateFestivalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ format: 'binary', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ format: 'date-time' })
  @IsDate()
  start_time: Date;

  @ApiProperty({ format: 'date-time' })
  @IsDate()
  end_time: Date;
}
