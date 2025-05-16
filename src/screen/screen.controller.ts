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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ServiceResponse } from '../common/model/service-response';
import { CreateSeatDto } from '../seat/dto/create-seat.dto';
import { SeatService } from '../seat/seat.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { ScreenQueries } from './dto/screen-queries.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { ScreenService } from './screen.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('screen')
export class ScreenController {
  constructor(
    private readonly screenService: ScreenService,
    private readonly seatService: SeatService,
  ) {}

  @Post()
  @Roles('ROLE_ADMIN')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async create(@Body() dto: CreateScreenDto) {
    const newScreen = await this.screenService.create(dto);
    return ServiceResponse.success(
      'Screen added successfully',
      { id: newScreen.id },
      HttpStatus.CREATED,
    );
  }

  @Post(':id/seat')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async createSeat(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateSeatDto,
  ) {
    const newSeat = await this.seatService.create({ ...dto, screen_id: id });
    return ServiceResponse.success(
      'Seat added successfully',
      { id: newSeat.id },
      HttpStatus.CREATED,
    );
  }

  @Get()
  @Roles('ROLE_ADMIN')
  @ApiExtraModels(ScreenQueries)
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: ScreenQueries) {
    const screens = await this.screenService.findAll(query);
    return ServiceResponse.success('Fetched all screens', screens);
  }

  @Get(':id')
  @Roles('ROLE_ADMIN')
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const screen = await this.screenService.findOne(id);
    if (!screen) throw new NotFoundException(`Screen #${id} not found`);
    return ServiceResponse.success(`Found screen #${id}`, screen);
  }

  @Patch(':id')
  @Roles('ROLE_ADMIN')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScreenDto,
  ) {
    await this.findOne(id);
    await this.screenService.update(id, dto);
    return ServiceResponse.success(`Deleted screen #${id}`, null);
  }

  @Delete(':id')
  @Roles('ROLE_ADMIN')
  @ApiResponse({ type: ServiceResponse })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.findOne(id);
    await this.screenService.remove(id);
    return ServiceResponse.success(`Deleted screen #${id}`, null);
  }
}
