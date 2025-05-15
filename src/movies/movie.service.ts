import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import config from '../config/config';
import { CreateMovieDto } from './dto/create.movie.dto';
import { MovieQueries } from './dto/movie-queries.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {}

  create(dto: CreateMovieDto): Promise<Movie> {
    return this.movieRepo.save(dto);
  }

  findAll(query: MovieQueries) {
    const limit = query.limit || config.queryLimit,
      offset = query.page ? (query.page - 1) * query.limit : 0;

    const where: FindOptionsWhere<Movie>[] = [];
    if (query.title) where.push({ title: ILike(`%${query.title}%`) });
    if (query.author) where.push({ author: ILike(`%${query.author}%`) });

    return this.movieRepo.find({
      where,
      order: query.sort
        ? { [query.sort]: query.order || config.order }
        : undefined,
      skip: offset,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.movieRepo.findOne({ where: { id } });
  }

  update(id: number, dto: UpdateMovieDto) {
    return this.movieRepo.update(id, dto);
  }

  remove(id: number) {
    return this.movieRepo.delete(id);
  }
}
