import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
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

    // return {
    //   data: items,
    //   pagination: {
    //     total,
    //     page: +page,
    //     limit: take,
    //     totalPages: Math.ceil(total / take),
    //   },
    // };
  }
}
