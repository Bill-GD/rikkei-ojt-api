import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import config from '../config/config';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { FestivalQueries } from './dto/festival-queries.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { Festival } from './entities/festival.entity';

@Injectable()
export class FestivalService {
  constructor(
    @InjectRepository(Festival)
    private festivalRepository: Repository<Festival>,
  ) {}

  async create(dto: CreateFestivalDto) {
    await this.festivalRepository.save(dto);
    return { message: 'Added festival successfully' };
  }

  findAll(query: FestivalQueries) {
    const limit = query.limit || config.queryLimit,
      offset = query.page ? (query.page - 1) * query.limit : undefined;

    return this.festivalRepository.find({
      where: {
        ...(query.title && { title: Like(`%${query.title}%`) }),
      },
      skip: offset ?? 0,
      take: limit,
      order: query.sortFields.includes(query.sort)
        ? { [query.sort]: query.order || config.order }
        : undefined,
    });
  }

  findOne(id: number) {
    return this.festivalRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateFestivalDto) {
    await this.festivalRepository.update(id, dto);
    return;
  }

  remove(id: number) {
    return this.festivalRepository.delete(id);
  }
}
