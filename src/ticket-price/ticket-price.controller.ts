import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ServiceResponse } from '../common/model/service-response';
import { CreateTicketPriceDto } from './dto/create-ticket-price.dto';
import { TicketPriceService } from './ticket-price.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ticket-price')
export class TicketPriceController {
  constructor(private ticketPriceService: TicketPriceService) {}

  @Post()
  @Roles('ROLE_ADMIN')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  async create(@Body() dto: CreateTicketPriceDto) {
    const newTicket = await this.ticketPriceService.create(dto);
    return ServiceResponse.success(
      'Ticket price created successfully',
      { id: newTicket.id },
      StatusCodes.CREATED,
    );
  }
}
