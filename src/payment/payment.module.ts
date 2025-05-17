import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from '../booking/booking.service';
import { Booking } from '../booking/entities/booking.entity';
import { SeatBooking } from '../booking/entities/seat-booking-entity';
import { Movie } from '../movies/entities/movie.entity';
import { TicketPrice } from '../ticket-price/entities/ticket-price.entity';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import { Seat } from 'src/seat/entities/seat.entity';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      Booking,
      SeatBooking,
      Seat,
      Movie,
      TicketPrice,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, BookingService],
})
export class PaymentModule {}
