import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { Booking } from '../booking/entities/booking.entity';
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
    // @InjectRepository(Movie)
    // private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Theater)
    private readonly theaterRepo: Repository<Theater>,
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

  getCountByTheater() {
    return this.theaterRepo.find({
      relations: ['screens', 'screen.showtimes', 'screen.showtimes.bookings'],
    });
  }
}
