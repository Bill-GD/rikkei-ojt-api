import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  async create(
    file: Express.Multer.File,
    createBannerDto: CreateBannerDto,
  ): Promise<Banner> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const fileUrl = `/uploads-banner/${file.filename}`;

    const banner = this.bannerRepository.create({
      ...createBannerDto,
      url: fileUrl,
    });

    try {
      return await this.bannerRepository.save(banner);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error saving the banner: ' + error.message);
      }
      throw new Error('Error saving the banner: An unknown error occurred');
    }
  }

  async findAll(options?: FindManyOptions<Banner>): Promise<Banner[]> {
    return this.bannerRepository.find(options);
  }

  async findOne(id: number): Promise<Banner> {
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
  ): Promise<Banner> {
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
      if (error instanceof Error) {
        throw new Error('Error updating the banner: ' + error.message);
      }
      throw new Error('Error updating the banner: An unknown error occurred');
    }
  }

  async remove(id: number): Promise<void> {
    const banner = await this.findOne(id);

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
