import { Injectable } from '@nestjs/common';
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
    return this.seatRepository.save(dto);
  }

  findAll() {
    return this.seatRepository.find();
  }

  findOne(id: number) {
    return this.seatRepository.findOneBy({ id });
  }

  update(id: number, dto: UpdateSeatDto) {
    return this.seatRepository.update(id, dto);
  }

  remove(id: number) {
    return this.seatRepository.delete(id);
  }
}
