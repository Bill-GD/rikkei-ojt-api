import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ServiceResponse } from '../common/model/service-response';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiResponse({ type: ServiceResponse })
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  @ApiResponse({ type: ServiceResponse })
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: ServiceResponse })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ type: ServiceResponse })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  @ApiResponse({ type: ServiceResponse })
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
