import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import SeatType from '../seat/entities/seat-type.enum';
import { Seat } from '../seat/entities/seat.entity';
import {
  MovieType,
  TicketPrice,
} from '../ticket-price/entities/ticket-price.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingSeat } from './entities/booking-seat-entity';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(BookingSeat)
    private readonly bookingSeatRepo: Repository<BookingSeat>,
    @InjectRepository(Seat)
    private readonly seatRepo: Repository<Seat>,
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(TicketPrice)
    private readonly ticketPriceRepo: Repository<TicketPrice>,
  ) {}

  async create(dto: CreateBookingDto) {
    const seatCount = dto.seat_ids.length;

    const seats: Seat[] = [];
    for (const id of dto.seat_ids) {
      seats.push((await this.seatRepo.findOneBy({ id }))!);
    }

    const movie = (await this.movieRepo.findOneBy({ id: dto.movie_id }))!;

    const ticketPrices = await Promise.all(
      seats.map(async (seat) => {
        const ticketPrice = await this.ticketPriceRepo.findOneBy({
          type_seat: seat.type as SeatType,
          type_movie: movie.type as MovieType,
        });
        if (!ticketPrice) {
          throw new NotFoundException(
            `Price for ${seat.type} seat and ${movie.type} movie not found`,
          );
        }
        return ticketPrice.price;
      }),
    );

    const totalCost = ticketPrices.reduce((p, c) => p + c, 0);

    const newBooking = await this.bookingRepo.save(
      this.bookingRepo.create({
        user_id: dto.user_id,
        showtime_id: dto.showtime_id,
        total_seat: seatCount,
        total_price_movie: totalCost,
      }),
    );
    const bookingSeats = seats.map((seat) =>
      this.bookingSeatRepo.create({
        booking: newBooking,
        seat: seat,
        quantity: seatCount,
      }),
    );
    await this.bookingSeatRepo.save(bookingSeats);
    return newBooking;
  }

  // getTotalPrice() {}

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, dto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
