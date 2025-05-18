import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class GenreQueries extends CommonQueries {
  @ApiPropertyOptional({ enum: ['id', 'genre_name'] })
  @IsOptional()
  @IsEnum(['id', 'genre_name'])
  declare sort?: string;

  @ApiPropertyOptional({ example: 'action' })
  @IsOptional()
  @IsString()
  genre_name?: string;
}
