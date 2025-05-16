import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Genre } from '../genre/entities/genre.entity';
import { CreateMovieDto } from './dto/create.movie.dto';
import { MovieQueries } from './dto/movie-queries.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { MovieGenre } from './entities/movie-genre.entity';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,
    @InjectRepository(MovieGenre)
    private readonly movieGenreRepo: Repository<MovieGenre>,
  ) {}

  async create(dto: CreateMovieDto): Promise<Movie> {
    const newMovie = await this.movieRepo.save(dto);
    for (const genreId of dto.genre_ids) {
      const genre = await this.genreRepo.findOneBy({ id: genreId });
      if (!genre) continue;

      const newMovieGenre = this.movieGenreRepo.create({
        movie_id: newMovie.id,
        genre_id: genreId,
      });
      await this.movieGenreRepo.save(newMovieGenre);
    }

    return newMovie;
  }

  findAll(query: MovieQueries) {
    query = plainToInstance(MovieQueries, query);

    const where: FindOptionsWhere<Movie>[] = [];
    if (query.title) where.push({ title: ILike(`%${query.title}%`) });
    if (query.author) where.push({ author: ILike(`%${query.author}%`) });

    return this.movieRepo.find({
      where,
      order: query.sort ? { [query.sort]: query.getOrder() } : undefined,
      skip: query.getOffset(),
      take: query.getLimit(),
    });
  }

  findOne(id: number) {
    return this.movieRepo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateMovieDto) {
    if (dto.genre_ids !== undefined) {
      await this.movieGenreRepo.delete({ movie_id: id });
      for (const genreId of dto.genre_ids) {
        const genre = await this.genreRepo.findOneBy({ id: genreId });
        if (!genre) continue;

        const newMovieGenre = this.movieGenreRepo.create({
          movie_id: id,
          genre_id: genreId,
        });
        await this.movieGenreRepo.save(newMovieGenre);
      }
    }
    delete dto.genre_ids;
    return this.movieRepo.update(id, dto);
  }

  remove(id: number) {
    return this.movieRepo.delete(id);
  }
}
