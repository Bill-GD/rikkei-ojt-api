import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

 
  async create(file: Express.Multer.File, createBannerDto: CreateBannerDto): Promise<Banner> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Check if the file has a valid filename (which should be created by multer)
    const fileUrl = `/uploads-banner/${file.filename}`;

    // Create the banner instance with the provided details
    const banner = this.bannerRepository.create({
      ...createBannerDto,
      url: fileUrl,
    });

    try {
      // Save the banner to the database
      return await this.bannerRepository.save(banner);
    } catch (error) {
      // Handle potential database errors
      throw new Error('Error saving the banner: ' + error.message);
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
    if (!validTypes.some(type => file.mimetype.startsWith(type))) {
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


 
  async remove(id: number): Promise<void> {
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
