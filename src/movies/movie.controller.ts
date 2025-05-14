import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import createSingleMulterStorage from '../config/multerStorage';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create.movie.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiConsumes('multipart/form-data')
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
          example: 120,
        },
        release_date: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Movie created successfully' })
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
  async create(
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; trailer?: Express.Multer.File[] },
    @Body() createMovieDto: CreateMovieDto,
  ) {
    if (files.image) {
      createMovieDto.image = files.image
        .map((file) => `uploads/movies/image/${file.filename}`)
        .join(',');
    }
    if (files.trailer && files.trailer[0]) {
      createMovieDto.trailer = `uploads/movies/trailer/${files.trailer[0].filename}`;
    }

    console.log(createMovieDto);
    return this.movieService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of movies' })
  async findAll(@Query() query: any) {
    return this.movieService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Movie found' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findOne(@Param('id') id: number) {
    return this.movieService.findOne(id);
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
  @ApiOperation({ summary: 'Delete a movie by ID' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async remove(@Param('id') id: number) {
    return this.movieService.remove(id);
  }
}
