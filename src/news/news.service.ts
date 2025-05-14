import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import config from '../config/config';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsQuery } from './dto/news-query.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepo: Repository<News>,
  ) { }

  create(dto: CreateNewsDto) {
    return this.newsRepo.save(dto);
  }

  findAll(query: NewsQuery) {
    const limit = query.limit || config.queryLimit,
      offset = query.page ? (query.page - 1) * query.limit : undefined;
    const entityFields = Object.getOwnPropertyNames(new News());

    return this.newsRepo.find({
      where: {
        ...(query.festival_id && { festival_id: query.festival_id }),
        ...(query.title && { title: Like(`%${query.title}%`) }),
      },
      skip: offset ?? 0,
      take: limit,
      order: entityFields.includes(query.sort)
        ? { [query.sort]: query.order || config.order }
        : undefined,
    });
  }

  findOne(id: number) {
    return this.newsRepo.findOne({ where: { id } });
  }

  update(id: number, dto: UpdateNewsDto) {
    return this.newsRepo.update(id, dto);
  }

  remove(id: number) {
    return this.newsRepo.delete(id);
  }
}
