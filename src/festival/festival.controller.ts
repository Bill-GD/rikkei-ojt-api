import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiResponse,
} from '@nestjs/swagger';
import { ServiceResponse } from '../common/model/service-response';
import { createSingleMulterStorage } from '../common/utils/multerStorage';
import { CreateNewsDto } from '../news/dto/create-news.dto';
import { NewsService } from '../news/news.service';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { FestivalQueries } from './dto/festival-queries.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { FestivalService } from './festival.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('festivals')
export class FestivalController {
  constructor(
    private readonly festivalService: FestivalService,
    private readonly newsService: NewsService,
  ) {}

  @Post()
  @Roles('ROLE_ADMIN')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: createSingleMulterStorage(true, false),
    }),
  )
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
      HttpStatus.CREATED,
    );
  }

  @Post(':id/news')
  @Roles('ROLE_ADMIN')
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
      HttpStatus.CREATED,
    );
  }

  @Get()
  @Roles('ROLE_ADMIN')
  @ApiExtraModels(FestivalQueries)
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: FestivalQueries) {
    const festivals = await this.festivalService.findAll(query);
    return ServiceResponse.success('Fetched all festivals', festivals);
  }

  @Get(':id')
  @Roles('ROLE_ADMIN')
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const fes = await this.festivalService.findOne(id);
    if (!fes) throw new NotFoundException(`Festival #${id} not found`);
    return ServiceResponse.success(`Fetched festival #${id}`, fes);
  }

  @Patch(':id')
  @Roles('ROLE_ADMIN')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: createSingleMulterStorage(true, false),
    }),
  )
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFestivalDto,
  ) {
    await this.findOne(id);
    await this.festivalService.update(id, dto);
    return ServiceResponse.success(
      `Updated festival #${id} successfully`,
      null,
    );
  }

  @Delete(':id')
  @Roles('ROLE_ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.findOne(id);
    await this.festivalService.remove(id);
    return ServiceResponse.success(
      `Deleted festival #${id} successfully`,
      null,
    );
  }
}
