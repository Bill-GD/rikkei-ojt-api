import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { Repository, FindManyOptions, Like } from 'typeorm';
import config from '../config/config';
import { BannerQueries } from './dto/banner-queries.dto';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import * as fs from 'fs';
import { join } from 'path';

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
    const limit = query.limit || config.queryLimit,
      offset = query.page ? (query.page - 1) * query.limit : undefined;

    return this.bannerRepository.find({
      where: query.type ? { type: Like(`%${query.type}%`) } : undefined,
      skip: offset ?? 0,
      take: limit,
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
