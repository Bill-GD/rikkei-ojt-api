import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from '../seat/entities/seat.entity';
import { ShowtimeService } from '../showtime/showtime.service';
import { UsersService } from '../users/users.service';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingSeat } from './entities/booking-seat-entity';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, BookingSeat, Seat])],
  controllers: [BookingController],
  providers: [BookingService, UsersService, ShowtimeService],
})
export class BookingModule {}
