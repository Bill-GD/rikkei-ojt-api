import { IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommonQueries } from '../../common/model/common-queries';

export class GetUsersQueryDto extends CommonQueries {
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

  @ApiPropertyOptional({ enum: ['created_at', 'first_name', 'email'] })
  @IsOptional()
  @IsEnum(['created_at', 'first_name', 'email'])
  declare sort: string;
}
