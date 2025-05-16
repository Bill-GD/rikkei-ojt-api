import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Like, Repository } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsQueries } from './dto/news-queries.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepo: Repository<News>,
  ) {}

  create(dto: CreateNewsDto) {
    return this.newsRepo.save(dto);
  }

  findAll(query: NewsQueries) {
    query = plainToInstance(NewsQueries, query);

    return this.newsRepo.find({
      where: {
        ...(query.festival_id && { festival_id: query.festival_id }),
        ...(query.title && { title: Like(`%${query.title}%`) }),
      },
      skip: query.getOffset(),
      take: query.getLimit(),
      order: query.sort ? { [query.sort]: query.getOrder() } : undefined,
    });
  }

  findOne(id: number) {
    return this.newsRepo.findOneBy({ id });
  }

  update(id: number, dto: UpdateNewsDto) {
    return this.newsRepo.update(id, dto);
  }

  remove(id: number) {
    return this.newsRepo.delete(id);
  }
}
