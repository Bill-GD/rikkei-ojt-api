import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { TheaterQueries } from './dto/theater-queries.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Theater } from './entities/theater.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class TheaterService {
  constructor(
    @InjectRepository(Theater)
    private theaterRepository: Repository<Theater>,
  ) {}

  create(dto: CreateTheaterDto) {
    return this.theaterRepository.save(dto);
  }

  findAll(query: TheaterQueries) {
    query = plainToInstance(TheaterQueries, query);

    const where: FindOptionsWhere<Theater>[] = [];
    if (query.name) where.push({ name: Like(`%${query.name}%`) });
    if (query.location) where.push({ location: Like(`%${query.location}%`) });

    return this.theaterRepository.find({
      where,
      skip: query.getOffset(),
      take: query.getLimit(),
      order: { [query.sort]: query.order },
    });
    // return {
    //   data: items,
    //   total,
    //   page,
    //   pageCount: Math.ceil(total / limit),
    // };
  }

  findOne(id: number) {
    return this.theaterRepository.findOne({ where: { id } });
  }

  update(id: number, dto: UpdateTheaterDto) {
    return this.theaterRepository.update(id, dto);
  }

  remove(id: number) {
    return this.theaterRepository.delete(id);
  }
}
