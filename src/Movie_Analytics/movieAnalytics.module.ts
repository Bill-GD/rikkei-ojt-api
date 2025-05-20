import { Module } from '@nestjs/common';
import { AnalyticsController } from './moiveAnalytics.controller';
import { AnalyticsService } from './movieAnalytics.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
