import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { ServiceResponse } from '../common/model/service-response';
import { NewsQuery } from './dto/news-query.dto';
import { NewsService } from './news.service';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiExtraModels(NewsQuery)
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: NewsQuery) {
    const allNews = await this.newsService.findAll(query);
    return ServiceResponse.success('Got all news', allNews);
  }

  @Get(':id')
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const news = await this.newsService.findOne(id);
    return ServiceResponse.success(`Found news #${id}`, news);
  }

  @Patch(':id')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNewsDto,
  ) {
    await this.newsService.update(id, dto);
    return ServiceResponse.success(`Updated news #${id}`, null);
  }

  @Delete(':id')
  @ApiResponse({ type: ServiceResponse })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.newsService.remove(id);
    return ServiceResponse.success(`Deleted news #${id}`, null);
  }
}
