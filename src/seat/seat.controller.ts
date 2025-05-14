import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Controller('seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post()
  create(@Body() dto: CreateSeatDto) {
    return this.seatService.create(dto);
  }

  @Get()
  findAll() {
    return this.seatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.seatService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSeatDto) {
    return this.seatService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.seatService.remove(id);
  }
}
