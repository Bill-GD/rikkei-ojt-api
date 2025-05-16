import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateScreenDto } from './dto/create-screen.dto';
import { ScreenQueries } from './dto/screen-queries.dto';
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

  async findAll(query: ScreenQueries) {
    query = plainToInstance(ScreenQueries, query);

    return this.screenRepo.find({
      skip: query.getOffset(),
      take: query.getLimit(),
      order: { [query.sort]: query.order },
    });
    // return {
    //   data: items,
    //   total,
    //   page,
    //   pageCount: Math.ceil(total / limit),
    // };
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
