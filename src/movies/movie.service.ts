import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Genre } from '../genre/entities/genre.entity';
import { DateRangeDto } from './dto/date-range.dto';
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

  async getMovieByStatus() {
    const movies = await this.movieRepo.find({
      relations: ['showtimes'],
    });

    const statusCount: Record<string, number> = {
      coming_soon: 0,
      showing: 0,
      ended: 0,
    };

    const now = new Date();

    for (const movie of movies) {
      if (movie.release_date > now) {
        statusCount.coming_soon++;
      } else if (
        movie.release_date <= now &&
        movie.showtimes?.some((s) => new Date(s.end_time) >= now)
      ) {
        statusCount.showing++;
      } else {
        statusCount.ended++;
      }
    }

    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
    }));
  }

  async getMovieByGenre() {
    const genres = await this.genreRepo.find({
      relations: ['movieGenres', 'movieGenres.movie'],
    });

    return genres.map((genre) => ({
      genre: genre.genre_name,
      movie_count: genre.movieGenres?.length || 0,
    }));
  }

  async getMovieRevenue(query: DateRangeDto) {
    const { startDate, endDate } = query;

    const movies = await this.movieRepo.find({
      relations: ['showtimes', 'showtimes.bookings'],
    });

    return movies.map((movie) => {
      let total_revenue = 0;
      for (const showtime of movie.showtimes) {
        for (const booking of showtime.bookings) {
          const createdAt = new Date(booking.created_at);
          if (
            (!startDate || createdAt >= new Date(startDate)) &&
            (!endDate || createdAt <= new Date(endDate))
          ) {
            total_revenue += booking.total_price_movie;
          }
        }
      }
      return {
        title: movie.title,
        total_revenue,
      };
    });
  }
}
