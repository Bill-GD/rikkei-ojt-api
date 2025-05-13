import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '../common/model/service-response';
import multerStorage from '../config/multerStorage';
import { CreateNewsDto } from '../news/dto/create-news.dto';
import { NewsService } from '../news/news.service';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { FestivalQueries } from './dto/festival-queries.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { FestivalService } from './festival.service';

@Controller('festivals')
export class FestivalController {
  constructor(
    private readonly festivalService: FestivalService,
    private readonly newsService: NewsService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: multerStorage }))
  @ApiResponse({ type: ServiceResponse })
  async create(
    @Body() dto: CreateFestivalDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) dto.image = `uploads/${file.filename}`;
    const newFes = await this.festivalService.create(dto);

    return ServiceResponse.success(
      'Festival added successfully',
      { id: newFes.id },
      StatusCodes.CREATED,
    );
  }

  @Post(':id/news')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async createNews(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateNewsDto,
  ) {
    const newNews = await this.newsService.create({ ...dto, festival_id: id });
    return ServiceResponse.success(
      'News added successfully',
      { id: newNews.id },
      StatusCodes.CREATED,
    );
  }

  @Get()
  @ApiExtraModels(FestivalQueries)
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: FestivalQueries) {
    const festivals = await this.festivalService.findAll(
      plainToInstance(FestivalQueries, query),
    );

    return ServiceResponse.success('Got all festivals', festivals);
  }

  @Get(':id')
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const fes = await this.festivalService.findOne(id);
    return ServiceResponse.success(`Found festival #${id}`, fes);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: multerStorage }))
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFestivalDto,
  ) {
    await this.festivalService.update(id, dto);
    return ServiceResponse.success(`Updated festival #${id}`, null);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.festivalService.remove(id);
    return ServiceResponse.success(`Deleted festival #${id}`, null);
  }
}
