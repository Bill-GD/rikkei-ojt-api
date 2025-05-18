import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('movie-status')
  @ApiOperation({ summary: 'Danh sách phim đang chiếu và sắp chiếu' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách chi tiết phim',
    schema: {
      example: {
        nowShowing: [
          {
            id: 1,
            title: 'The Batman',
            type: '2D',
            duration_min: 130,
            release_date: '2024-05-01T00:00:00.000Z',
          },
        ],
        comingSoon: [
          {
            id: 2,
            title: 'Deadpool & Wolverine',
            type: '3D',
            duration_min: 120,
            release_date: '2024-07-25T00:00:00.000Z',
          },
        ],
      },
    },
  })
  getMovieStatusStats(@Query('from') from: string, @Query('to') to: string) {
    return this.analyticsService.getMovieStatusStats(from, to);
  }
}
