import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from '../genre/entities/genre.entity';
import { GenreService } from '../genre/genre.service';
import { MovieGenre } from '../movies/entities/movie-genre.entity';
import { Movie } from '../movies/entities/movie.entity';
import { MovieService } from '../movies/movie.service';
import { Seat } from '../seat/entities/seat.entity';
import { SeatService } from '../seat/seat.service';
import { TicketPrice } from '../ticket-price/entities/ticket-price.entity';
import { TicketPriceService } from '../ticket-price/ticket-price.service';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { SeatBooking } from './entities/seat-booking-entity';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      SeatBooking,
      Seat,
      Movie,
      TicketPrice,
      Genre,
      MovieGenre,
    ]),
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    SeatService,
    MovieService,
    TicketPriceService,
    GenreService,
  ],
})
export class BookingModule {}
