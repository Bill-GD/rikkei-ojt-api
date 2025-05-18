import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiConsumes, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { UserRoles } from '../common/enum/user-role.enum';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { ServiceResponse } from '../common/model/service-response';
import { NewsQueries } from './dto/news-queries.dto';
import { NewsService } from './news.service';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiExtraModels(NewsQueries)
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: NewsQueries) {
    const allNews = await this.newsService.findAll(query);
    return ServiceResponse.success('Got all news', allNews);
  }

  @Get(':id')
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const news = await this.newsService.findOne(id);
    return ServiceResponse.success(`Found news #${id}`, news);
  }

  @Patch(':id')
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNewsDto,
  ) {
    await this.findOne(id);
    await this.newsService.update(id, dto);
    return ServiceResponse.success(`Updated news #${id}`, null);
  }

  @Delete(':id')
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiResponse({ type: ServiceResponse })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.findOne(id);
    await this.newsService.remove(id);
    return ServiceResponse.success(`Deleted news #${id}`, null);
  }
}
