import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { Festival } from './entities/festival.entity';

@Injectable()
export class FestivalService {
  constructor(
    @InjectRepository(Festival)
    private festivalRepository: Repository<Festival>,
  ) {}

  async create(dto: CreateFestivalDto) {
    // this.festivalRepository.create({});
    await this.festivalRepository.save(dto);
    return { message: 'Added festival successfully' };
  }

  findAll() {
    return this.festivalRepository.find();
  }

  findOne(id: number) {
    return this.festivalRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateFestivalDto) {
    await this.festivalRepository.update(id, dto);
    return;
  }

  remove(id: number) {
    return this.festivalRepository.delete(id);
  }
}
