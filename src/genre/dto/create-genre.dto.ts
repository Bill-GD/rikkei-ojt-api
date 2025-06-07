import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({ example: 'action' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  genre_name: string;
}
