import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommonQueries } from '../../common/model/common-queries';

export class GetUsersQueryDto extends CommonQueries {
  @ApiPropertyOptional({
    description: 'Tìm kiếm tổng quát theo tên, email, phone, địa chỉ',
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  first_name?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  last_name?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  address?: string;

  @ApiPropertyOptional({ enum: ['created_at', 'first_name', 'email'] })
  @IsEnum(['created_at', 'first_name', 'email'])
  declare sort: string;
}
