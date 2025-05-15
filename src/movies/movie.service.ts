import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import config from '../config/config';
import { MovieQueries } from './dto/movie-queries.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create.movie.dto';
import { Genre } from '../genre/entities/genre.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const genre = await this.genreRepository.findOneBy({
      id: createMovieDto.genreId,
    });

    if (!genre) {
      throw new Error('Genre not found');
    }
    const movie = this.movieRepository.create({
      ...createMovieDto,
      genres: [genre],
    });

    return this.movieRepository.save(movie);
  }

  async findAll(query: MovieQueries) {
    const limit = query.limit || config.queryLimit,
      offset = query.page ? (query.page - 1) * query.limit : 0;

    const where: FindOptionsWhere<Movie>[] = [];
    if (query.title) where.push({ title: ILike(`%${query.title}%`) });
    if (query.author) where.push({ author: ILike(`%${query.author}%`) });

    const result = await this.movieRepository.findAndCount({
      where,
      order: query.sort
        ? { [query.sort]: query.order || config.order }
        : undefined,
      skip: offset,
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

  update(id: number, dto: UpdateMovieDto) {
    return this.movieRepository.update(id, dto);
  }

  remove(id: number) {
    return this.movieRepository.delete(id);
  }
}
