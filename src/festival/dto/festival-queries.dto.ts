import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CommonQueries } from '../../common/model/common-queries';

export class FestivalQueries extends CommonQueries {
  @ApiProperty({
    required: false,
    type: 'string',
    description: 'Search for festival with title containing this',
  })
  @IsString()
  @IsOptional()
  title: string;

  sortFields: string[] = ['id', 'start_time', 'end_time'];
}
