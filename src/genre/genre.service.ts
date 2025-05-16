import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import config from '../config/config';
import { GenreQueries } from './dto/genre-queries.dto';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  create(dto: CreateGenreDto) {
    return this.genreRepository.save(dto);
  }

  findAll(query: GenreQueries) {
    query = plainToInstance(GenreQueries, query);

    const where: FindOptionsWhere<Genre>[] = [];
    if (query.genre_name) {
      where.push({ genre_name: ILike(`%${query.genre_name}%`) });
    }

    return this.genreRepository.find({
      where,
      order: query.sort ? { [query.sort]: query.getOrder() } : undefined,
      skip: query.getOffset(),
      take: query.getLimit(),
    });
  }

  findOne(id: number) {
    return this.genreRepository.findOneBy({ id });
  }

  update(id: number, dto: UpdateGenreDto) {
    return this.genreRepository.update(id, dto);
  }

  async remove(id: number) {
    return this.genreRepository.delete(id);
  }
}
