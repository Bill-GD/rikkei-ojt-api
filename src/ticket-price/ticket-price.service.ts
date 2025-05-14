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
}
