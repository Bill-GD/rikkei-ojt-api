import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { ServiceResponse } from '../common/model/service-response';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { SeatService } from './seat.service';

@Controller('seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Get()
  @ApiResponse({ type: ServiceResponse })
  async findAll() {
    const seats = await this.seatService.findAll();
    return ServiceResponse.success('Fetched all seats', seats);
  }

  @Get(':id')
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const seat = await this.seatService.findOne(id);
    if (!seat) throw new NotFoundException(`Seat #${id} not found`);
    return ServiceResponse.success(`Fetched seat #${id}`, seat);
  }

  @Patch(':id')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSeatDto,
  ) {
    await this.findOne(id);
    await this.seatService.update(id, dto);
    return ServiceResponse.success(`Updated seat #${id} successfully`, null);
  }

  @Delete(':id')
  @ApiResponse({ type: ServiceResponse })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.findOne(id);
    await this.seatService.remove(id);
    return ServiceResponse.success(`Deleted seat #${id} successfully`, null);
  }
}
