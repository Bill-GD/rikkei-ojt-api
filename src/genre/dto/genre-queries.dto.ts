import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class GenreQueries extends CommonQueries {
  @ApiPropertyOptional({
    name: 'sort',
    enum: ['id', 'genre_name'],
    description: `Sort by one of the entity's properties`,
  })
  @IsOptional()
  @IsEnum(['id', 'genre_name'])
  declare sort?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  genre_name?: string;
}
