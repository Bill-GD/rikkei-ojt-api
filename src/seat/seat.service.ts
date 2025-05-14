import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { Seat } from './entities/seat.entity';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}

  create(dto: CreateSeatDto) {
    const seat = this.seatRepository.create(dto);
    return this.seatRepository.save(seat);
  }

  findAll() {
    return this.seatRepository.find();
  }

  async findOne(id: number) {
    const seat = await this.seatRepository.findOneBy({ id });
    if (!seat) throw new NotFoundException('Seat not found');
    return seat;
  }

  async update(id: number, dto: UpdateSeatDto) {
    const seat = await this.findOne(id);
    Object.assign(seat, dto);
    return this.seatRepository.save(seat);
  }

  async remove(id: number) {
    const seat = await this.findOne(id);
    return this.seatRepository.remove(seat);
  }
}
