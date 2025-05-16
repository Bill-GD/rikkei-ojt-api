import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommonQueries } from '../../common/model/common-queries';
import { SeatType, MovieType } from '../entities/ticket-price.entity';

export class GetTicketPricesQueryDto extends CommonQueries {
  @ApiPropertyOptional({ enum: SeatType, description: 'Loại ghế' })
  @IsOptional()
  @IsEnum(SeatType)
  type_seat: SeatType;

  @ApiPropertyOptional({ enum: MovieType, description: 'Loại phim' })
  @IsOptional()
  @IsEnum(MovieType)
  type_movie: MovieType;

  @ApiPropertyOptional({
    name: 'sort',
    enum: ['id', 'price', 'start_time', 'end_time'],
    description: `Sort by one of the entity's properties`,
  })
  @IsOptional()
  @IsEnum(['id', 'price', 'start_time', 'end_time'])
  declare sort: string;
}
