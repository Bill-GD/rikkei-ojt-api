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
} from '@nestjs/common';
import { ServiceResponse } from '../common/model/service-response';
import { TheaterService } from './theater.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('theater')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @Post()
  @Roles('ROLE_ADMIN')
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
  @Roles('ROLE_ADMIN')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Trang hiện xem',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 3,
    description: 'Số bản ghi mỗi trang',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'createdAt',
    description: 'Trường để sắp xếp',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    example: 'DESC',
    description: 'Thứ tự sắp xếp',
  })
  @ApiResponse({ type: ServiceResponse })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy = 'createdAt', //giá trị default của sortBy
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    const pageNumber = parseInt(page || '1', 10);
    const limitNumber = parseInt(limit || '3', 10);

    const theaters = await this.theaterService.findAll(
      pageNumber,
      limitNumber,
      sortBy,
      sortOrder,
    );

    return ServiceResponse.success(`Got all theaters`, theaters);
  }

  @Get(':id')
  @Roles('ROLE_ADMIN')
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const theater = await this.theaterService.findOne(id);
    return ServiceResponse.success(`Found theater #${id}`, theater);
  }

  @Patch(':id')
  @Roles('ROLE_ADMIN')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTheaterDto,
  ) {
    await this.theaterService.update(id, dto);
    return ServiceResponse.success(`Updated theater #${id}`, null);
  }

  @Delete(':id')
  @Roles('ROLE_ADMIN')
  @ApiResponse({ type: ServiceResponse })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.theaterService.remove(id);
    return ServiceResponse.success(`Deleted theater #${id}`, null);
  }
}
