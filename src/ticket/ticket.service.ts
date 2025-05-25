import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { Booking } from '../booking/entities/booking.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Theater } from '../theater/entities/theater.entity';
import { TicketPrice } from './entities/ticket-price.entity';
import { CreateTicketPriceDto } from './dto/create-ticket-price.dto';
import { UpdateTicketPriceDto } from './dto/update-ticket-price.dto';
import { GetTicketPricesQueryDto } from './dto/get-ticket-prices-query.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketPrice)
    private readonly ticketPriceRepo: Repository<TicketPrice>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Theater)
    private readonly theaterRepo: Repository<Theater>,
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {}

  async create(dto: CreateTicketPriceDto) {
    return this.ticketPriceRepo.save(dto);
  }

  findOne(id: number) {
    return this.ticketPriceRepo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateTicketPriceDto) {
    return this.ticketPriceRepo.update(id, dto);
  }

  async delete(id: number) {
    await this.ticketPriceRepo.delete(id);
  }

  getAll(query: GetTicketPricesQueryDto) {
    query = plainToInstance(GetTicketPricesQueryDto, query);
    const { type_seat, type_movie } = query;

    const take = query.getLimit();
    const skip = query.getOffset();

    const qb = this.ticketPriceRepo.createQueryBuilder('ticket_price');

    if (type_seat) {
      qb.andWhere('ticket_price.type_seat = :type_seat', { type_seat });
    }

    if (type_movie) {
      qb.andWhere('ticket_price.type_movie = :type_movie', { type_movie });
    }

    if (query.sort) {
      qb.orderBy(
        `ticket_price.${query.sort}`,
        query.getOrder().toUpperCase() as 'ASC' | 'DESC' | undefined,
      );
    }
    qb.skip(skip).take(take);

    return qb.getMany();
  }

  getTicketSoldCount() {
    return this.bookingRepo.sum('total_seat');
  }

  async getCountByTheater() {
    const theaters = await this.theaterRepo.find({
      relations: ['screens', 'screens.showtimes', 'screens.showtimes.bookings'],
    });

    return theaters.map((th) => {
      let ticketCount = 0;
      const { name, id } = th;

      th.screens?.forEach((sc) => {
        sc.showtimes?.forEach((sh) => {
          sh.bookings?.forEach((b) => (ticketCount += b.total_seat));
        });
      });
      return { id, name, ticketCount };
    });
  }

  async getCountByMovie() {
    const movies = await this.movieRepo.find({
      relations: ['showtimes', 'showtimes.bookings'],
    });

    return movies.map((m) => {
      let ticketCount = 0;
      const { title, id } = m;

      m.showtimes?.forEach((sh) => {
        sh.bookings?.forEach((b) => (ticketCount += b.total_seat));
      });
      return { id, title, ticketCount };
    });
  }
}
