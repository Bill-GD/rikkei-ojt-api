import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import multerStorage from '../config/multerStorage';
import { CreateNewsDto } from '../news/dto/create-news.dto';
import { NewsService } from '../news/news.service';
import { FestivalService } from './festival.service';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';

@Controller('festival')
export class FestivalController {
  constructor(
    private readonly festivalService: FestivalService,
    private readonly newsService: NewsService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: multerStorage }))
  @Post()
  create(
    @Body() dto: CreateFestivalDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) dto.image = `uploads/${file.filename}`;
    return this.festivalService.create(dto);
  }

  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @Post(':id/news')
  async createNews(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateNewsDto,
  ) {
    return this.newsService.create({ ...dto, festival_id: id });
  }

  @Get()
  findAll() {
    return this.festivalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.festivalService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: multerStorage }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFestivalDto,
  ) {
    return this.festivalService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.festivalService.remove(id);
  }
}
