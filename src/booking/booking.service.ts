import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import SeatType from '../seat/entities/seat-type.enum';
import { Seat } from '../seat/entities/seat.entity';
import {
  MovieType,
  TicketPrice,
} from '../ticket-price/entities/ticket-price.entity';
import { BookingQueries } from './dto/booking-queries.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { SeatBooking } from './entities/seat-booking-entity';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(SeatBooking)
    private readonly SeatBookingRepo: Repository<SeatBooking>,
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
      seats.map(async (seat: Seat) => {
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
    const SeatBookings = seats.map((seat) =>
      this.SeatBookingRepo.create({
        booking: newBooking,
        seat: seat,
        quantity: seatCount,
      }),
    );
    await this.SeatBookingRepo.save(SeatBookings);
    return newBooking;
  }

  // getTotalPrice() {}

  findAll(query: BookingQueries) {
    query = plainToInstance(BookingQueries, query);

    const where: FindOptionsWhere<Booking>[] = [];
    if (query.user_id) where.push({ user_id: query.user_id });
    if (query.showtime_id) where.push({ showtime_id: query.showtime_id });

    return this.bookingRepo.find({
      where,
      order: query.sort ? { [query.sort]: query.getOrder() } : undefined,
      skip: query.getOffset(),
      take: query.getLimit(),
    });
  }

  findOne(id: number) {
    return this.bookingRepo.findOneBy({ id });
  }

  update(id: number, dto: UpdateBookingDto) {
    return this.bookingRepo.update(id, dto);
  }

  remove(id: number) {
    return this.bookingRepo.delete(id);
  }
}
