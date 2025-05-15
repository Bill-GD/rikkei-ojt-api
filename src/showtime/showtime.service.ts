import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { GetShowtimesQueryDto } from './dto/get-showtimes-query.dto';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime) private showtimeRepo: Repository<Showtime>,
  ) {}

  async create(dto: CreateShowtimeDto) {
    const showtime = this.showtimeRepo.create(dto);
    return this.showtimeRepo.save(showtime);
  }

  async findAll(query: GetShowtimesQueryDto) {
    const { movieTitle, sortBy, sortOrder, page = 1, limit = 10 } = query;

    const qb = this.showtimeRepo
      .createQueryBuilder('showtime')
      .leftJoinAndSelect('showtime.movie', 'movie')
      .leftJoinAndSelect('showtime.screen', 'screen');

    if (movieTitle) {
      qb.where('LOWER(movie.title) LIKE LOWER(:title)', {
        title: `%${movieTitle}%`,
      });
    }

    if (sortBy) {
      qb.orderBy(`showtime.${sortBy}`, sortOrder || 'ASC').addOrderBy(
        'showtime.id',
        'ASC',
      );
    } else {
      qb.orderBy('showtime.id', 'ASC');
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async update(id: number, dto: UpdateShowtimeDto) {
    const existing = await this.showtimeRepo.findOneBy({ id });
    if (!existing) throw new NotFoundException('Showtime not found');
    await this.showtimeRepo.update(id, dto);
  }

  async delete(id: number) {
    const existing = await this.showtimeRepo.findOneBy({ id });
    if (!existing) throw new NotFoundException('Showtime not found');
    await this.showtimeRepo.remove(existing);
  }
}
