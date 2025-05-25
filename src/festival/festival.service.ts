import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Like, Repository } from 'typeorm';
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
    return await this.festivalRepository.save(dto);
  }

  findAll(query: FestivalQueries) {
    query = plainToInstance(FestivalQueries, query);

    return this.festivalRepository.find({
      where: query.title ? { title: Like(`%${query.title}%`) } : undefined,
      skip: query.getOffset(),
      take: query.getLimit(),
      order: query.sort ? { [query.sort]: query.getOrder() } : undefined,
    });
  }

  findOne(id: number) {
    return this.festivalRepository.findOneBy({ id });
  }

  async update(id: number, dto: UpdateFestivalDto) {
    return await this.festivalRepository.update(id, dto);
  }

  remove(id: number) {
    return this.festivalRepository.delete(id);
  }

  async getStats() {
    const total = await this.festivalRepository.count();

    const completed = await this.festivalRepository
      .createQueryBuilder('festival')
      .where('festival.end_time < NOW()')
      .getCount();

    const upcoming = await this.festivalRepository
      .createQueryBuilder('festival')
      .where('festival.start_time > NOW()')
      .getCount();

    const ongoing = await this.festivalRepository
      .createQueryBuilder('festival')
      .where('festival.start_time <= NOW() AND festival.end_time >= NOW()')
      .getCount();

    return {
      total,
      completed,
      upcoming,
      ongoing,
    };
  }
}
