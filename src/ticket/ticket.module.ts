import { Module } from '@nestjs/common';
import { Booking } from '../booking/entities/booking.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Theater } from '../theater/entities/theater.entity';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketPrice } from './entities/ticket-price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketPrice, Booking, Theater, Movie])],
  providers: [TicketService],
  controllers: [TicketController],
  exports: [TypeOrmModule, TicketService],
})
export class TicketModule {}
