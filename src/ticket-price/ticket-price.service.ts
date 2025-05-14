import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketPrice } from './entities/ticket-price.entity';
import { CreateTicketPriceDto } from './dto/create-ticket-price.dto';
import { UpdateTicketPriceDto } from './dto/update-ticket-price.dto';
import { GetTicketPricesQueryDto } from './dto/get-ticket-prices-query.dto';

@Injectable()
export class TicketPriceService {
  constructor(
    @InjectRepository(TicketPrice)
    private readonly ticketPriceRepo: Repository<TicketPrice>,
  ) {}

  async create(dto: CreateTicketPriceDto) {
    if (dto.end_time <= dto.start_time) {
      throw new BadRequestException('End time must be greater than start time');
    }
    const ticketPrice = this.ticketPriceRepo.create(dto);
    return this.ticketPriceRepo.save(ticketPrice);
  }

  async update(id: number, dto: UpdateTicketPriceDto) {
    const ticket = await this.ticketPriceRepo.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket price not found');
    }

    if (dto.start_time && dto.end_time && dto.end_time <= dto.start_time) {
      throw new BadRequestException('End time must be greater than start time');
    }

    Object.assign(ticket, dto);
    return this.ticketPriceRepo.save(ticket);
  }

  async delete(id: number) {
    const ticket = await this.ticketPriceRepo.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket price not found');
    }
    await this.ticketPriceRepo.remove(ticket);
  }

  async getAll(query: GetTicketPricesQueryDto) {
    const {
      type_seat,
      type_movie,
      sort_by = 'created_at',
      sort_order = 'DESC',
      page = '1',
      limit = '10',
    } = query;

    const take = +limit;
    const skip = (+page - 1) * take;

    const qb = this.ticketPriceRepo.createQueryBuilder('ticket_price');

    if (type_seat) {
      qb.andWhere('ticket_price.type_seat = :type_seat', { type_seat });
    }

    if (type_movie) {
      qb.andWhere('ticket_price.type_movie = :type_movie', { type_movie });
    }

    qb.orderBy(`ticket_price.${sort_by}`, sort_order).skip(skip).take(take);

    const [items, total] = await qb.getManyAndCount();

    return {
      data: items,
      pagination: {
        total,
        page: +page,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }
}
