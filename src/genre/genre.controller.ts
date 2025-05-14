import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '../common/model/service-response';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreService } from './genre.service';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  async create(@Body() dto: CreateGenreDto) {
    const newGenre = await this.genreService.create(dto);
    return ServiceResponse.success(
      'Genre added successfully',
      { id: newGenre.id },
      StatusCodes.CREATED,
    );
  }

  @Get()
  async findAll() {
    const genres = await this.genreService.findAll();
    return ServiceResponse.success('Got all genres', genres);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const genre = await this.genreService.findOne(id);
    return ServiceResponse.success(`Found genre #${id}`, genre);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGenreDto,
  ) {
    await this.genreService.update(id, dto);
    return ServiceResponse.success(`Updated genre #${id}`, null);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.genreService.remove(id);
    return ServiceResponse.success(`Deleted genre #${id}`, null);
  }
}
