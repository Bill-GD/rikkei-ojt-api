import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Genre } from '../genre/entities/genre.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Showtime } from '../showtime/entities/showtime.entity';
import { DateRangeDto } from './dto/dateRange.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,

    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,

    private readonly dataSource: DataSource,
  ) {}

  async getMovieByStatus(): Promise<{ status: string; count: number }[]> {
    const result = await this.dataSource
      .createQueryBuilder(Movie, 'm')
      .select(
        `
        CASE
          WHEN m.release_date > CURRENT_DATE THEN 'COMING_SOON'
          WHEN m.release_date <= CURRENT_DATE AND EXISTS (
            SELECT 1 FROM showtime s
            WHERE s.movie_id = m.id
              AND s.end_time >= CURRENT_TIMESTAMP
          ) THEN 'NOW_SHOWING'
          ELSE 'ENDED'
        END AS status
      `,
      )
      .addSelect('COUNT(*)', 'count')
      .groupBy('status')
      .getRawMany();

    return result.map((r) => ({
      status: r.status,
      count: parseInt(r.count, 10),
    }));
  }

  async getMovieByGenre(): Promise<
    { genre_name: string; movie_count: number }[]
  > {
    const result = await this.dataSource
      .createQueryBuilder('genre', 'g')
      .innerJoin('g.movieGenres', 'mg')
      .innerJoin('mg.movie', 'm')
      .select('g.genre_name', 'genre_name')
      .addSelect('COUNT(m.id)', 'movie_count')
      .groupBy('g.genre_name')
      .getRawMany();

    return result.map((r) => ({
      genre_name: r.genre_name,
      movie_count: parseInt(r.movie_count, 10),
    }));
  }

  async getMovieRevenue(
    query: DateRangeDto,
  ): Promise<{ title: string; total_revenue: number }[]> {
    const { startDate, endDate } = query;

    const qb = this.dataSource
      .createQueryBuilder('movie', 'm')
      .innerJoin('m.showtimes', 's')
      .innerJoin('s.bookings', 'b')
      .select('m.title', 'title')
      .addSelect('SUM(b.total_price_movie)', 'total_revenue');

    if (startDate) {
      qb.andWhere('b.created_at >= :startDate', { startDate });
    }
    if (endDate) {
      qb.andWhere('b.created_at <= :endDate', { endDate });
    }

    const result = await qb.groupBy('m.title').getRawMany();

    return result.map((r) => ({
      title: r.title,
      total_revenue: parseFloat(r.total_revenue),
    }));
  }
}
