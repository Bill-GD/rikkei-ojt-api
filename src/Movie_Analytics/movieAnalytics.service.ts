import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DateRangeDto } from './dto/dateRange.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}

  async getMovieByStatus(): Promise<{ status: string; count: number }[]> {
    return this.dataSource.query(`
      SELECT
        CASE
          WHEN m.release_date > CURRENT_DATE THEN 'COMING_SOON'
          WHEN m.release_date <= CURRENT_DATE AND EXISTS (
            SELECT 1 FROM showtime s WHERE s.movie_id = m.id
              AND s.start_time <= CURRENT_TIMESTAMP 
              AND s.end_time >= CURRENT_TIMESTAMP
          ) THEN 'NOW_SHOWING'
          ELSE 'ENDED'
        END AS status,
        COUNT(*) AS count
      FROM movie m
      GROUP BY status
    `);
  }

  async getMovieByGenre(): Promise<{ genre_name: string; movie_count: number }[]> {
    return this.dataSource.query(`
      SELECT g.genre_name, COUNT(*) as movie_count
      FROM movie m
      JOIN movie_genre mg ON m.id = mg.movie_id
      JOIN genre g ON g.id = mg.genre_id
      GROUP BY g.genre_name
    `);
  }

  async getWeeklyRevenue(): Promise<{ week: string; total_revenue: number }[]> {
    return this.dataSource.query(`
    SELECT 
      CONCAT(YEAR(created_at), '-', WEEK(created_at, 1)) AS week,
      SUM(total_price_movie) as total_revenue
    FROM booking
    GROUP BY week
    ORDER BY week;
  `);
  }

  async getBookingStatusRatio(): Promise<{ status: string; count: number }[]> {
    return this.dataSource.query(`
    SELECT 'ALL' AS status, COUNT(*) AS count
    FROM booking
  `);
  }

  async getMovieRevenue(query: DateRangeDto): Promise<{ title: string; total_revenue: number }[]> {
    const { startDate, endDate } = query;
    return this.dataSource.query(
      `SELECT 
      m.title,
      SUM(b.total_price_movie) AS total_revenue
      FROM movie m
      JOIN showtime s ON m.id = s.movie_id
      JOIN booking b ON s.id = b.showtime_id
      WHERE (? IS NULL OR b.created_at >= ?)
        AND (? IS NULL OR b.created_at <= ?)
      GROUP BY m.title`,
      [startDate, startDate, endDate, endDate],
    );
  }
}
