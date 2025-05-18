import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class TheaterQueries extends CommonQueries {
  @ApiPropertyOptional({ enum: ['id', 'name', 'created_at', 'updated_at'] })
  @IsOptional()
  @IsEnum(['id', 'name', 'created_at', 'updated_at'])
  declare sort?: string;

  @ApiPropertyOptional({ example: 'ABC Theater' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'ABC Street' })
  @IsOptional()
  @IsString()
  location?: string;
}
