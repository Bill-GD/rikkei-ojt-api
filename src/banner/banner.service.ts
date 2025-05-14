import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { Repository, FindManyOptions } from 'typeorm';
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

  findAll(options?: FindManyOptions<Banner>) {
    return this.bannerRepository.find(options);
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
