import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class MovieQueries extends CommonQueries {
  @ApiPropertyOptional({ enum: ['id', 'duration_min', 'release_date'] })
  @IsOptional()
  @IsEnum(['id', 'duration_min', 'release_date'])
  declare sort?: string;

  @ApiPropertyOptional({ example: 'Minecraft Movie' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Jared Hess' })
  @IsOptional()
  @IsString()
  author?: string;
}
