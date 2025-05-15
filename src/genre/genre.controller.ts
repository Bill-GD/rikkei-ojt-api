import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServiceResponse } from '../common/model/service-response';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreQueries } from './dto/genre-queries.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreService } from './genre.service';
import { ApiBearerAuth, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  @Roles('ROLE_ADMIN')
  @ApiResponse({ type: ServiceResponse })
  async create(@Body() dto: CreateGenreDto) {
    const newGenre = await this.genreService.create(dto);
    return ServiceResponse.success(
      'Genre added successfully',
      { id: newGenre.id },
      HttpStatus.CREATED,
    );
  }

  @Get()
  @Roles('ROLE_ADMIN')
  @ApiExtraModels(GenreQueries)
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: GenreQueries) {
    const genres = await this.genreService.findAll(query);
    return ServiceResponse.success('Got all genres', genres);
  }

  @Get(':id')
  @Roles('ROLE_ADMIN')
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const genre = await this.genreService.findOne(id);
    // if (!genre) throw new NotFoundException(`Genre #${id} not found`);
    return ServiceResponse.success(`Found genre #${id}`, genre);
  }

  @Put(':id')
  @Roles('ROLE_ADMIN')
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGenreDto,
  ) {
    await this.genreService.update(id, dto);
    return ServiceResponse.success(`Updated genre #${id}`, null);
  }

  @Delete(':id')
  @Roles('ROLE_ADMIN')
  @ApiResponse({ type: ServiceResponse })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.genreService.remove(id);
    return ServiceResponse.success(`Deleted genre #${id}`, null);
  }
}
