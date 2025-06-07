import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpStatus,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UserRoles } from '../common/enum/user-role.enum';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { ServiceResponse } from '../common/model/service-response';
import { TheaterQueries } from './dto/theater-queries.dto';
import { TheaterService } from './theater.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { ApiConsumes, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('theater')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @Post()
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async create(@Body() dto: CreateTheaterDto) {
    const newTheater = await this.theaterService.create(dto);
    return ServiceResponse.success(
      'Theater added successfully',
      { id: newTheater.id },
      HttpStatus.CREATED,
    );
  }

  @Get()
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiExtraModels(TheaterQueries)
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: TheaterQueries) {
    const theaters = await this.theaterService.findAll(query);
    return ServiceResponse.success(`Fetched all theaters`, theaters);
  }

  @Get(':id')
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const theater = await this.theaterService.findOne(id);
    if (!theater) throw new NotFoundException(`Theater #${id} not found`);
    return ServiceResponse.success(`Fetched theater #${id}`, theater);
  }

  @Patch(':id')
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTheaterDto,
  ) {
    await this.findOne(id);
    await this.theaterService.update(id, dto);
    return ServiceResponse.success(`Updated theater #${id} successfully`, null);
  }

  @Delete(':id')
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiResponse({ type: ServiceResponse })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.findOne(id);
    await this.theaterService.remove(id);
    return ServiceResponse.success(`Deleted theater #${id} successfully`, null);
  }
}
