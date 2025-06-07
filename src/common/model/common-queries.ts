import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import config from '../../config/config';

export class CommonQueries {
  @ApiPropertyOptional({ type: 'integer', example: 1 })
  @Transform(({ value }) => parseInt(value as string))
  @IsInt()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    type: 'integer',
    example: config.queryLimit,
    default: config.queryLimit,
  })
  @Transform(({ value }) => parseInt(value as string))
  @IsInt()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    name: 'sort',
    enum: [],
    description: `Sort by one of the entity's properties`,
  })
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: string;

  getOffset() {
    return this.page && this.limit ? (this.page - 1) * this.limit : 0;
  }

  getLimit() {
    return this.limit || config.queryLimit;
  }

  getOrder() {
    return this.order || config.order;
  }
}
