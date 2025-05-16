import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository, Like } from 'typeorm';
import config from '../config/config';
import { BannerQueries } from './dto/banner-queries.dto';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  create(dto: CreateBannerDto) {
    return this.bannerRepository.save(dto);
  }

  findAll(query: BannerQueries) {
    query = plainToInstance(BannerQueries, query);

    return this.bannerRepository.find({
      where: query.type ? { type: Like(`%${query.type}%`) } : undefined,
      skip: query.getOffset(),
      take: query.getLimit(),
      order: query.sort
        ? { [query.sort]: query.order || config.order }
        : undefined,
    });
  }

  findOne(id: number) {
    return this.bannerRepository.findOne({ where: { id } });
  }

  update(id: number, dto: Partial<CreateBannerDto>) {
    return this.bannerRepository.update(id, dto);
  }

  remove(id: number) {
    return this.bannerRepository.delete(id);
  }
}
