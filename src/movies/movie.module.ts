import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from '../booking/booking.service';
import { SeatBooking } from '../booking/entities/seat-booking.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Genre } from '../genre/entities/genre.entity';
import { GenreService } from '../genre/genre.service';
import { Seat } from '../seat/entities/seat.entity';
import { SeatService } from '../seat/seat.service';
import { Showtime } from '../showtime/entities/showtime.entity';
import { ShowtimeService } from '../showtime/showtime.service';
import { TicketPrice } from '../ticket/entities/ticket-price.entity';
import { TicketModule } from '../ticket/ticket.module';
import { TicketService } from '../ticket/ticket.service';
import { MovieGenre } from './entities/movie-genre.entity';
import { Movie } from './entities/movie.entity';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Movie,
      Genre,
      MovieGenre,
      Booking,
      SeatBooking,
      Seat,
      TicketPrice,
      Showtime,
    ]),
    TicketModule,
  ],
  controllers: [MovieController],
  providers: [
    BookingService,
    SeatService,
    MovieService,
    TicketService,
    GenreService,
    ShowtimeService,
  ],
})
export class MovieModule {}
