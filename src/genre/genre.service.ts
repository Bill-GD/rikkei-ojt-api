import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  create(createGenreDto: CreateGenreDto) {
    const genre = this.genreRepository.create(createGenreDto);
    return this.genreRepository.save(genre);
  }

  findAll() {
    return this.genreRepository.find();
  }

  async findOne(id: number) {
    const genre = await this.genreRepository.findOneBy({ id });
    if (!genre) throw new NotFoundException('Genre not found');
    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.findOne(id);
    Object.assign(genre, updateGenreDto);
    return this.genreRepository.save(genre);
  }

  async remove(id: number) {
    const genre = await this.findOne(id);
    return this.genreRepository.remove(genre);
  }
}
