import { IsOptional, IsEnum, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SeatType, MovieType } from '../entities/ticket-price.entity';

export class GetTicketPricesQueryDto {
  @ApiPropertyOptional({ enum: SeatType, description: 'Loại ghế' })
  @IsOptional()
  @IsEnum(SeatType)
  type_seat?: SeatType;

  @ApiPropertyOptional({ enum: MovieType, description: 'Loại phim' })
  @IsOptional()
  @IsEnum(MovieType)
  type_movie?: MovieType;

  @ApiPropertyOptional({ description: 'Sắp xếp theo trường', example: 'price' })
  @IsOptional()
  sort_by?: string;

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp: ASC | DESC',
    example: 'DESC',
  })
  @IsOptional()
  sort_order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ description: 'Trang hiện tại', example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ description: 'Số lượng mỗi trang', example: '10' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
