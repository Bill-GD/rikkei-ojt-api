import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommonQueries } from '../../common/model/common-queries';

export class GetUsersQueryDto extends CommonQueries {
  @ApiPropertyOptional({
    description: 'Tìm kiếm tổng quát theo tên, email, phone, địa chỉ',
  })
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ enum: ['created_at', 'first_name', 'email'] })
  @IsOptional()
  @IsEnum(['created_at', 'first_name', 'email'])
  declare sort?: string;
}
