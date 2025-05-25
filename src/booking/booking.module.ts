import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from '../genre/entities/genre.entity';
import { MovieGenre } from '../movies/entities/movie-genre.entity';
import { Movie } from '../movies/entities/movie.entity';
import { MovieService } from '../movies/movie.service';
import { Seat } from '../seat/entities/seat.entity';
import { SeatService } from '../seat/seat.service';
import { TicketPrice } from '../ticket/entities/ticket-price.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { SeatBooking } from './entities/seat-booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Seat,
      SeatBooking,
      Movie,
      TicketPrice,
      Genre,
      MovieGenre,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService, SeatService, MovieService],
})
export class BookingModule {}
