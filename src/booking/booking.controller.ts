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
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { ServiceResponse } from '../common/model/service-response';
import { BookingService } from './booking.service';
import { BookingQueries } from './dto/booking-queries.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @ApiExtraModels(BookingQueries)
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: BookingQueries) {
    const bookings = await this.bookingService.findAll(query);
    return ServiceResponse.success('Fetched all bookings', bookings);
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
