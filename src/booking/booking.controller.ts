import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  Query,
  Post,
} from '@nestjs/common';
import { ApiConsumes, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { ServiceResponse } from '../common/model/service-response';
import { MovieService } from '../movies/movie.service';
import { SeatService } from '../seat/seat.service';
import { BookingService } from './booking.service';
import { BookingPriceDto } from './dto/booking-price.dto';
import { BookingQueries } from './dto/booking-queries.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly seatService: SeatService,
    private readonly movieService: MovieService,
  ) {}

  @Get()
  @ApiExtraModels(BookingQueries)
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: BookingQueries) {
    const bookings = await this.bookingService.findAll(query);
    return ServiceResponse.success('Fetched all bookings', bookings);
  }

  @Post('/price')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async getPrice(@Body() dto: BookingPriceDto) {
    for (const seatId of dto.seat_ids) {
      const seat = await this.seatService.findOne(seatId);
      if (!seat) {
        throw new NotFoundException(`Seat #${seatId} not found`);
      }
    }

    if (!(await this.movieService.findOne(dto.movie_id))) {
      throw new NotFoundException(`Movie #${dto.movie_id} not found`);
    }

    const bookings = await this.bookingService.getTotalPrice(dto);
    return ServiceResponse.success('Calculated total price', bookings);
  }

  @Get(':id')
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const booking = await this.bookingService.findOne(id);
    if (!booking) throw new NotFoundException(`Booking #${id} not found`);
    return ServiceResponse.success(`Fetched booking #${id}`, booking);
  }

  @Patch(':id')
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingDto,
  ) {
    await this.findOne(id);
    await this.bookingService.update(id, dto);
    return ServiceResponse.success(`Updated booking #${id} successfully`, null);
  }

  @Delete(':id')
  @ApiResponse({ type: ServiceResponse })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.findOne(id);
    await this.bookingService.remove(id);
    return ServiceResponse.success(`Deleted booking #${id} successfully`, null);
  }
}
