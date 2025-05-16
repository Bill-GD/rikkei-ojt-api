import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { GetShowtimesQueryDto } from './dto/get-showtimes-query.dto';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime) private showtimeRepo: Repository<Showtime>,
  ) {}

  create(dto: CreateShowtimeDto) {
    const showtime = this.showtimeRepo.create(dto);
    return this.showtimeRepo.save(showtime);
  }

  findAll(query: GetShowtimesQueryDto) {
    const { title } = query;
    query = plainToInstance(GetShowtimesQueryDto, query);

    const qb = this.showtimeRepo
      .createQueryBuilder('showtime')
      .leftJoinAndSelect('showtime.movie', 'movie')
      .leftJoinAndSelect('showtime.screen', 'screen');

    if (title) {
      qb.where('LOWER(movie.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      });
    }

    if (query.sort) {
      qb.orderBy(
        `showtime.${query.sort}`,
        query.order.toUpperCase() as 'ASC' | 'DESC' | undefined,
      ).addOrderBy('showtime.id', 'ASC');
    } else {
      qb.orderBy('showtime.id', 'ASC');
    }

    return qb.skip(query.getOffset()).take(query.getLimit()).getMany();

    // return { data, total, page, limit };
  }

  findOne(id: number) {
    return this.showtimeRepo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateShowtimeDto) {
    await this.showtimeRepo.update(id, dto);
  }

  async delete(id: number) {
    await this.showtimeRepo.delete(id);
  }
}
