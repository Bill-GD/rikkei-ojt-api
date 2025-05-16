import { Injectable } from '@nestjs/common';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Screen } from './entities/screen.entity';

@Injectable()
export class ScreenService {
  constructor(
    @InjectRepository(Screen)
    private readonly screenRepo: Repository<Screen>,
  ) {}

  create(dto: CreateScreenDto) {
    return this.screenRepo.save(dto);
  }

  async findAll(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
  ) {
    const [items, total] = await this.screenRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [sortBy]: sortOrder,
      },
    });
    return {
      data: items,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return this.screenRepo.findOneBy({ id });
  }

  update(id: number, dto: UpdateScreenDto) {
    return this.screenRepo.update(id, dto);
  }

  remove(id: number) {
    return this.screenRepo.delete(id);
  }
}
