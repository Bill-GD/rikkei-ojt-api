import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateSeatDto } from './dto/create-seat.dto';
import { SeatQueries } from './dto/seat-queries.dto';
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

  findAll(query: SeatQueries) {
    query = plainToInstance(SeatQueries, query);

    const { type, is_booked, seat_number, screen_id } = query,
      where: FindOptionsWhere<Seat> = {};

    if (type) where.type = type;
    if (is_booked) where.is_booked = is_booked;
    if (seat_number) where.seat_number = seat_number;
    if (screen_id) where.screen_id = screen_id;

    return this.seatRepository.find({
      where,
      order: query.sort ? { [query.sort]: query.getOrder() } : undefined,
      skip: query.getOffset(),
      take: query.getLimit(),
    });
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
