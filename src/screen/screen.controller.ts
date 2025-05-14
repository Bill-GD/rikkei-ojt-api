import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ScreenService } from './screen.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('screen')
export class ScreenController {
  constructor(private readonly screenService: ScreenService) {}

  @Post()
  @Roles('ROLE_ADMIN')
  @ApiOperation({ summary: 'Create a screen' })
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  async create(@Body() dto: CreateScreenDto) {
    return this.screenService.create(dto);
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
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy = 'createdAt', //giá trị default của sortBy
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    const pageNumber = parseInt(page || '1', 10);
    const limitNumber = parseInt(limit || '3', 10);

    return this.screenService.findAll(
      pageNumber,
      limitNumber,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  @Roles('ROLE_ADMIN')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.screenService.findOne(id);
  }

  @Patch(':id')
  @Roles('ROLE_ADMIN')
  @ApiOperation({ summary: 'Update a screen by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Screen ID' })
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateScreenDto) {
    return this.screenService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ROLE_ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.screenService.remove(id);
  }
}
