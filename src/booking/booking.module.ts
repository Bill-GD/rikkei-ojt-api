import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { MovieService } from '../movies/movie.service';
import { Seat } from '../seat/entities/seat.entity';
import { SeatService } from '../seat/seat.service';
import { TicketPrice } from '../ticket-price/entities/ticket-price.entity';
import { TicketPriceService } from '../ticket-price/ticket-price.service';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingSeat } from './entities/booking-seat-entity';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookingSeat, Seat, Movie, TicketPrice]),
  ],
  controllers: [BookingController],
  providers: [BookingService, SeatService, MovieService, TicketPriceService],
})
export class BookingModule {}
