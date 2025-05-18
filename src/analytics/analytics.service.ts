import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async getMovieStatusStats(fromStr: string, toStr: string) {
    const from = new Date(fromStr);
    const to = new Date(toStr);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new Error('Invalid date format');
    }
    if (from > to) {
      throw new Error('From date must be less than to date');
    }

    const nowShowing = await this.movieRepository.find({
      where: {
        release_date: Between(from, to),
      },
      order: { release_date: 'DESC' },
    });

    const comingSoon = await this.movieRepository.find({
      where: {
        release_date: MoreThan(to),
      },
      order: { release_date: 'ASC' },
    });

    const noLongerShowing = await this.movieRepository.find({
      where: {
        release_date: LessThan(from),
      },
      order: { release_date: 'DESC' },
    });

    return {
      nowShowing,
      comingSoon,
      noLongerShowing,
    };
  }
}
