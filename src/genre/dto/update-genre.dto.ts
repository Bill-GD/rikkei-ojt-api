import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CreateGenreDto } from './create-genre.dto';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {
  @ApiProperty({ example: 'action' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  genre_name: string;
}
