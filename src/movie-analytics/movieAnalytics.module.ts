import { Module } from '@nestjs/common';
import { AnalyticsController } from './movieAnalytics.controller';
import { AnalyticsService } from './movieAnalytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Showtime } from '../showtime/entities/showtime.entity';
import { Genre } from '../genre/entities/genre.entity';
import { Booking } from '../booking/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Showtime, Genre, Booking])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
