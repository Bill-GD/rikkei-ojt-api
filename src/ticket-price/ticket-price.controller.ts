import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ServiceResponse } from '../common/model/service-response';
import { CreateTicketPriceDto } from './dto/create-ticket-price.dto';
import { UpdateTicketPriceDto } from './dto/update-ticket-price.dto';
import { TicketPriceService } from './ticket-price.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ticket-price')
export class TicketPriceController {
  constructor(private ticketPriceService: TicketPriceService) {}

  @Post()
  @Roles('ROLE_ADMIN')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async create(@Body() dto: CreateTicketPriceDto) {
    const newTicket = await this.ticketPriceService.create(dto);
    return ServiceResponse.success(
      'Ticket price created successfully',
      { id: newTicket.id },
      StatusCodes.CREATED,
    );
  }

  @Patch(':id')
  @Roles('ROLE_ADMIN')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTicketPriceDto,
  ) {
    await this.ticketPriceService.update(id, dto);
    return ServiceResponse.success(`Updated ticket price #${id}`, null);
  }

  @Delete(':id')
  @Roles('ROLE_ADMIN')
  @ApiResponse({ type: ServiceResponse })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.ticketPriceService.delete(id);
    return ServiceResponse.success(`Deleted ticket price #${id}`, null);
  }
}
