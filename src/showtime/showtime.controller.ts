import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UserRoles } from '../common/enum/user-role.enum';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { ShowtimeService } from './showtime.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { GetShowtimesQueryDto } from './dto/get-showtimes-query.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { ServiceResponse } from '../common/model/service-response';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.ROLE_ADMIN)
@Controller('showtime')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async create(@Body() dto: CreateShowtimeDto) {
    const data = await this.showtimeService.create(dto);
    return ServiceResponse.success(
      'Created showtime',
      data,
      HttpStatus.CREATED,
    );
  }

  @Get()
  @ApiResponse({ type: ServiceResponse })
  async getAll(@Query() query: GetShowtimesQueryDto) {
    const result = await this.showtimeService.findAll(query);
    return ServiceResponse.success('Fetched all showtimes', result);
  }

  @Patch(':id')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShowtimeDto,
  ) {
    if (!(await this.showtimeService.findOne(id))) {
      throw new NotFoundException(`Showtime #${id} not found`);
    }
    await this.showtimeService.update(id, dto);
    return ServiceResponse.success(`Updated showtime #${id}`, null);
  }

  @Delete(':id')
  @ApiResponse({ type: ServiceResponse })
  async delete(@Param('id', ParseIntPipe) id: number) {
    if (!(await this.showtimeService.findOne(id))) {
      throw new NotFoundException(`Showtime #${id} not found`);
    }
    await this.showtimeService.delete(id);
    return ServiceResponse.success(`Deleted showtime #${id}`, null);
  }
}
