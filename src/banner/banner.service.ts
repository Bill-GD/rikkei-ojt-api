import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions } from "typeorm";
import { Banner } from "./entities/banner.entity";
import { NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from "./dto/create-banner.dto";

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async create(createBannerDto: CreateBannerDto): Promise<Banner> {
    const banner = this.bannerRepository.create(createBannerDto);
    return this.bannerRepository.save(banner);
  }

  async findAll(options?: FindManyOptions<Banner>): Promise<Banner[]> {
    return this.bannerRepository.find(options);
  }

  async findOne(id: number): Promise<Banner> {
    const banner = await this.bannerRepository.findOne({ where: { id } });

    if (!banner) {
    throw new NotFoundException(`Banner with ${id} not found`);
    }

    return banner;
  }

   async update(id: number, updateBannerDto: Partial<CreateBannerDto>): Promise<Banner> {
    const banner = await this.findOne(id)
    Object.assign(banner, updateBannerDto);
    return this.bannerRepository.save(banner);
    }

  async remove(id: number): Promise<void> {
    await this.bannerRepository.delete(id);
  }
}