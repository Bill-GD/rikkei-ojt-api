import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async create(dto: CreateBannerDto) {
    return await this.bannerRepository.save(dto);
  }

  findAll(options?: FindManyOptions<Banner>) {
    return this.bannerRepository.find(options);
  }

  async findOne(id: number) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return banner;
  }

  async update(
    id: number,
    updateBannerDto: Partial<CreateBannerDto>,
    file?: Express.Multer.File,
  ) {
    const banner = await this.findOne(id);

    if (!banner) {
      throw new Error('Banner not found');
    }

    if (file) {
      const validTypes = ['image/', 'video/'];
      if (!validTypes.some((type) => file.mimetype.startsWith(type))) {
        throw new Error('Invalid file type. Only image or video allowed.');
      }
      banner.url = `/uploads-banner/${file.filename}`;
    }

    Object.assign(banner, updateBannerDto);

    try {
      return await this.bannerRepository.save(banner);
    } catch (error) {
      throw new Error('Error updating the banner: ' + error.message);
    }
  }

  async remove(id: number) {
    const banner = await this.findOne(id);

    // Optionally, delete the banner file from the server storage as well
    if (banner.url) {
      const fileName = banner.url.split('/').pop()!;
      const filePath = join(__dirname, '..', '..', 'uploads-banner', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await this.bannerRepository.delete(id);
  }
}
