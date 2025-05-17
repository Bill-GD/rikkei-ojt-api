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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { BookingService } from '../booking/booking.service';
import { CreateBookingDto } from '../booking/dto/create-booking.dto';
import { ServiceResponse } from '../common/model/service-response';
import { createSingleMulterStorage } from '../common/utils/multerStorage';
import { CreateMovieDto } from './dto/create.movie.dto';
import { MovieQueries } from './dto/movie-queries.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly bookingService: BookingService,
  ) {}

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
    files: { image: Express.Multer.File[]; trailer: Express.Multer.File[] },
    @Body() dto: CreateMovieDto,
  ) {
    if (files.image) dto.image = `uploads/${files.image[0].filename}`;
    if (files.trailer) dto.trailer = `uploads/${files.trailer[0].filename}`;

    const newMovie = await this.movieService.create(dto);
    return ServiceResponse.success(
      'Movie added successfully',
      { id: newMovie.id },
      HttpStatus.CREATED,
    );
  }

  @Post(':id')
  @ApiResponse({ type: ServiceResponse })
  async bookMovie(
    @Query('id', ParseIntPipe) movieId: number,
    dto: CreateBookingDto,
  ) {
    const newBooking = await this.bookingService.create({
      ...dto,
      movie_id: movieId,
    });
    return ServiceResponse.success(
      `Booked seat successfully`,
      { id: newBooking.id },
      HttpStatus.CREATED,
    );
  }

  @Get()
  @ApiExtraModels(MovieQueries)
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: MovieQueries) {
    const movies = await this.movieService.findAll(query);
    return ServiceResponse.success('Fetched all movies', movies);
  }

  @Get(':id')
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id') id: number) {
    const movie = await this.movieService.findOne(id);
    if (!movie) throw new NotFoundException(`Movie #${id} not found`);
    return ServiceResponse.success(`Fetched movie #${id}`, movie);
  }

  @Patch(':id')
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
  async update(
    @Param('id') id: number,
    @UploadedFiles()
    files: { image: Express.Multer.File[]; trailer: Express.Multer.File[] },
    @Body() dto: UpdateMovieDto,
  ) {
    await this.findOne(id);

    if (files.image) dto.image = `uploads/${files.image[0].filename}`;
    if (files.trailer) dto.trailer = `uploads/${files.trailer[0].filename}`;

    await this.movieService.update(id, dto);
    return ServiceResponse.success(`Updated movie #${id} successfully`, null);
  }

  @Delete(':id')
  @ApiResponse({ type: ServiceResponse })
  async remove(@Param('id') id: number) {
    await this.findOne(id);
    await this.movieService.remove(id);
    return ServiceResponse.success(`Deleted movie #${id} successfully`, null);
  }
}
