import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import config from '../../config/config';

export class CommonQueries {
  @ApiPropertyOptional({ type: 'integer' })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  page: number;

  @ApiPropertyOptional({ type: 'integer' })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  limit: number;

  @ApiPropertyOptional({
    name: 'sort',
    enum: [],
    description: `Sort by one of the entity's properties`,
  })
  @IsOptional()
  @IsEnum([''])
  sort: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order: string;

  getOffset() {
    return this.page ? (this.page - 1) * this.limit : 0;
  }

  getLimit() {
    return this.limit || config.queryLimit;
  }

  getOrder() {
    return this.order || config.order;
  }
}
