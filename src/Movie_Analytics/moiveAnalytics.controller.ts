import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './movieAnalytics.service';
import { DateRangeDto } from './dto/dateRange.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('Analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('movie-status')
  getMovieByStatus() {
    return this.analyticsService.getMovieByStatus();
  }

  @Get('movie-by-genre')
  getMovieByGenre() {
    return this.analyticsService.getMovieByGenre();
  }

  @Get('weekly-revenue')
  getWeeklyRevenue() {
    return this.analyticsService.getWeeklyRevenue();
  }

  @Get('booking-status-ratio')
  getBookingStatusRatio() {
    return this.analyticsService.getBookingStatusRatio();
  }

  @Get('movie-revenue')
  getMovieRevenue(@Query() query: DateRangeDto) {
    return this.analyticsService.getMovieRevenue(query);
  }
}
