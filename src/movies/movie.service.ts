import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import config from '../config/config';
import { MovieQueries } from './dto/movie-queries.dto';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create.movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(movie);
  }

  async findAll(query: MovieQueries) {
    const {
      page = 1,
      limit = config.queryLimit,
      sort = 'id',
      order,
      title = '',
      author = '',
    } = query;
    const where = [
      { title: ILike(`%${title}%`) },
      { author: ILike(`%${author}%`) },
    ];

    const result = await this.movieRepository.findAndCount({
      where,
      order: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return result[0];

    // return {
    //   data: result[0],
    //   total: result[1],
    //   page: +page,
    //   limit: +limit,
    // };
  }

  findOne(id: number) {
    return this.movieRepository.findOne({ where: { id } });
  }

  update(id: number, updateMovieDto: Partial<CreateMovieDto>) {
    return this.movieRepository.update(id, updateMovieDto);
  }

  remove(id: number) {
    return this.movieRepository.delete(id);
  }
}
