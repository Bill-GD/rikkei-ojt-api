import { IsOptional, IsEnum, IsInt } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersQueryDto {
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @ApiPropertyOptional({
    description: 'Tìm kiếm tổng quát theo tên, email, phone, địa chỉ',
  })
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @ApiPropertyOptional()
  first_name?: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @ApiPropertyOptional()
  last_name?: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @ApiPropertyOptional()
  phone?: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @ApiPropertyOptional()
  address?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  order: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiPropertyOptional({ default: 10, minimum: 1 })
  limit: number = 10;

  @IsOptional()
  @ApiPropertyOptional({
    enum: ['created_at', 'first_name', 'email'],
    default: 'created_at',
  })
  sort_by: 'created_at' | 'first_name' | 'email' = 'created_at';
}
