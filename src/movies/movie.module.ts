import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from '../booking/booking.service';
import { Booking } from '../booking/entities/booking.entity';
import { Genre } from '../genre/entities/genre.entity';
import { MovieGenre } from './entities/movie-genre.entity';
import { Movie } from './entities/movie.entity';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Genre, MovieGenre, Booking])],
  controllers: [MovieController],
  providers: [MovieService, BookingService],
})
export class MovieModule {}
