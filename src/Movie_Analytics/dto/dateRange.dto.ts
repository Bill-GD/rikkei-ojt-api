import { IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DateRangeDto {
  @ApiProperty({
    description: 'Start date in YYYY-MM-DD format',
    example: '2025-01-01',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date in YYYY-MM-DD format',
    example: '2025-12-31',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
