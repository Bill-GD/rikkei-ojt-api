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
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ServiceResponse } from '../common/model/service-response';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { ScreenService } from './screen.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('screen')
export class ScreenController {
  constructor(private readonly screenService: ScreenService) {}

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

    const { data } = await this.screenService.findAll(
      pageNumber,
      limitNumber,
      sortBy,
      sortOrder,
    );
    return ServiceResponse.success('Fetched all screens', data);
  }

  @Get(':id')
  @Roles('ROLE_ADMIN')
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const screen = await this.screenService.findOne(id);
    if (!screen) {
      throw new NotFoundException(`Screen #${id} not found`);
    }
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
    await this.screenService.update(id, dto);
    return ServiceResponse.success(`Deleted screen #${id}`, null);
  }

  @Delete(':id')
  @Roles('ROLE_ADMIN')
  @ApiResponse({ type: ServiceResponse })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.screenService.remove(id);
    return ServiceResponse.success(`Deleted screen #${id}`, null);
  }
}
