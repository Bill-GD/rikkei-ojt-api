import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketPrice } from './entities/ticket-price.entity';
import { CreateTicketPriceDto } from './dto/create-ticket-price.dto';

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
}
