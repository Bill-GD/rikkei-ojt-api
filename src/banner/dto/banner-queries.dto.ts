import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class BannerQueries extends CommonQueries {
  @ApiPropertyOptional({ enum: ['id'] })
  @IsOptional()
  @IsEnum(['id'])
  declare sort?: string;

  @ApiPropertyOptional({
    name: 'type',
    enum: ['image', 'video'],
  })
  @IsOptional()
  @IsEnum(['image', 'video'])
  type?: string;
}
