import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '../common/model/service-response';
import { createSingleMulterStorage } from '../config/multerStorage';
import { CreateMovieDto } from './dto/create.movie.dto';
import { MovieQueries } from './dto/movie-queries.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'trailer', maxCount: 1 },
      ],
      { storage: createSingleMulterStorage(true, true) },
    ),
  )
  @ApiResponse({ type: ServiceResponse })
  async create(
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; trailer?: Express.Multer.File[] },
    @Body() dto: CreateMovieDto,
  ) {
    if (files.image) {
      dto.image = files.image
        .map((file) => `uploads/movies/image/${file.filename}`)
        .join(',');
    }
    if (files.trailer && files.trailer[0]) {
      dto.trailer = `uploads/movies/trailer/${files.trailer[0].filename}`;
    }

    const newMovie = await this.movieService.create(dto);
    return ServiceResponse.success(
      'Movie added successfully',
      { id: newMovie.id },
      StatusCodes.CREATED,
    );
  }

  @Get()
  @ApiExtraModels(MovieQueries)
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: MovieQueries) {
    const movies = await this.movieService.findAll(query);
    return ServiceResponse.success('Got all movies', movies);
  }

  @Get(':id')
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id') id: number) {
    const movie = await this.movieService.findOne(id);
    if (!movie) {
      return ServiceResponse.failure(
        `Movie #${id} not found`,
        null,
        StatusCodes.NOT_FOUND,
      );
    }
    return ServiceResponse.success(`Found movie #${id}`, movie);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a movie by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        descriptions: { type: 'string', nullable: true },
        author: { type: 'string', nullable: true },
        image: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
        trailer: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
        type: {
          type: 'string',
          enum: ['2D', '3D'],
        },
        duration_min: {
          type: 'integer',
          description: 'Duration of the movie in minutes',
        },
        release_date: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Movie updated successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'trailer', maxCount: 1 },
      ],
      { storage: createSingleMulterStorage(true, true) },
    ),
  )
  async update(
    @Param('id') id: number,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; trailer?: Express.Multer.File[] },
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    if (files.image) {
      updateMovieDto.image = files.image.map((file) => file.filename).join(',');
    }
    if (files.trailer && files.trailer[0]) {
      updateMovieDto.trailer = files.trailer[0].filename;
    }

    return this.movieService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiResponse({ type: ServiceResponse })
  async remove(@Param('id') id: number) {
    if (!(await this.findOne(id)).success) {
      return ServiceResponse.failure(
        `Movie #${id} not found`,
        null,
        StatusCodes.NOT_FOUND,
      );
    }
    await this.movieService.remove(id);
    return ServiceResponse.success(`Deleted movie #${id}`, null);
  }
}
