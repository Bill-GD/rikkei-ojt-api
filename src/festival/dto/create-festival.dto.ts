import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @Type(() => Date)
  @IsDate()
  start_time: Date;

  @ApiProperty({ format: 'date-time' })
  @Type(() => Date)
  @IsDate()
  end_time: Date;
}
