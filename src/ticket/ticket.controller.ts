import {
  BadRequestException,
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
  UseGuards,
} from '@nestjs/common';
import { ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRoles } from '../common/enum/user-role.enum';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { ServiceResponse } from '../common/model/service-response';
import { CreateTicketPriceDto } from './dto/create-ticket-price.dto';
import { UpdateTicketPriceDto } from './dto/update-ticket-price.dto';
import { TicketService } from './ticket.service';
import { GetTicketPricesQueryDto } from './dto/get-ticket-prices-query.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketPriceService: TicketService) {}

  @Post()
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async create(@Body() dto: CreateTicketPriceDto) {
    if (dto.end_time <= dto.start_time) {
      throw new BadRequestException('End time must be greater than start time');
    }
    const newTicket = await this.ticketPriceService.create(dto);
    return ServiceResponse.success(
      'Ticket price created successfully',
      { id: newTicket.id },
      HttpStatus.CREATED,
    );
  }

  @Get()
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiResponse({ type: ServiceResponse })
  async getAll(@Query() query: GetTicketPricesQueryDto) {
    const result = await this.ticketPriceService.getAll(query);
    return ServiceResponse.success(
      'Fetched ticket prices successfully',
      result,
    );
  }

  @Get('stats')
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiResponse({ type: ServiceResponse })
  async getStats() {
    const total = await this.ticketPriceService.getTicketSoldCount();
    const byTheater = await this.ticketPriceService.getCountByTheater();
    const byMovie = await this.ticketPriceService.getCountByMovie();

    return ServiceResponse.success(`Fetched ticket stats`, {
      total,
      byTheater,
      byMovie,
    });
  }

  @Patch(':id')
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTicketPriceDto,
  ) {
    if (!(await this.ticketPriceService.findOne(id))) {
      throw new NotFoundException(`Ticket price #${id} not found`);
    }
    if (dto.start_time && dto.end_time && dto.end_time <= dto.start_time) {
      throw new BadRequestException('End time must be greater than start time');
    }

    await this.ticketPriceService.update(id, dto);
    return ServiceResponse.success(`Updated ticket price #${id}`, null);
  }

  @Delete(':id')
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiResponse({ type: ServiceResponse })
  async delete(@Param('id', ParseIntPipe) id: number) {
    if (!(await this.ticketPriceService.findOne(id))) {
      throw new NotFoundException(`Ticket price #${id} not found`);
    }
    await this.ticketPriceService.delete(id);
    return ServiceResponse.success(`Deleted ticket price #${id}`, null);
  }
}
