import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ScreenService } from './screen.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { ApiConsumes, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('screen')
export class ScreenController {
  constructor(
    private readonly screenService: ScreenService
  ) {}

  @ApiOperation({summary: 'Create a screen'})
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @Post()
  async create(
    @Body() dto: CreateScreenDto
  ) {
    return this.screenService.create(dto);
  }


  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Trang hiện xem' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 3, description: 'Số bản ghi mỗi trang' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'createdAt', description: 'Trường để sắp xếp' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'DESC', description: 'Thứ tự sắp xếp' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy = 'createdAt', //giá trị default của sortBy
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    const pageNumber = parseInt(page  || '1',10) ;
    const limitNumber = parseInt(limit || '3',10) ;

    return this.screenService.findAll(pageNumber,limitNumber,sortBy,sortOrder);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.screenService.findOne(id);
  }

  @ApiOperation({summary: 'Update a screen by ID'})
  @ApiParam({name: 'id', type: Number, description:'Screen ID'})
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: number, 
  @Body() dto: UpdateScreenDto) {
    return this.screenService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.screenService.remove(id);
  }
}
