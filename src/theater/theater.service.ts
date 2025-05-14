import { Injectable } from '@nestjs/common';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Theater } from './entities/theater.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TheaterService {
  constructor(
    @InjectRepository(Theater)
    private theaterRepository: Repository<Theater>,
  ) {}

  create(dto: CreateTheaterDto) {
    return this.theaterRepository.save(dto);
  }

  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
  ) {
    const [items, total] = await this.theaterRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [sortBy]: sortOrder,
      },
    });
    return {
      data: items,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return this.theaterRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateTheaterDto) {
    await this.theaterRepository.update(id,dto);
    return {message: 'Updated theater successfully'};
  }

  remove(id: number) {
    return this.theaterRepository.delete(id);
  }
}
