import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiExtraModels } from '@nestjs/swagger';
import { NewsQuery } from './dto/news-query.dto';
import { NewsService } from './news.service';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiExtraModels(NewsQuery)
  findAll(@Query() query: NewsQuery) {
    return this.newsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.findOne(id);
  }

  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(NoFilesInterceptor())
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.remove(id);
  }
}
