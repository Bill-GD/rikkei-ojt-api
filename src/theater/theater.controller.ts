import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { ApiConsumes, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { NewsService } from 'src/news/news.service';
import { number } from 'zod';

@Controller('theater')
export class TheaterController {
  constructor(
    private readonly theaterService: TheaterService
  ) { }

  @ApiOperation({ summary: 'Create a theater' })
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @Post()
  async create(
    @Body() dto: CreateTheaterDto,
  ) {
    return this.theaterService.create(dto);
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

    return this.theaterService.findAll(pageNumber,limitNumber,sortBy,sortOrder);
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.theaterService.findOne(id);
  }



  @ApiOperation({ summary: 'Update a theater by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Theater ID' })
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTheaterDto) {
    return this.theaterService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.theaterService.remove(id);
  }
}

