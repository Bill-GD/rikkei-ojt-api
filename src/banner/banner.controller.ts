import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ServiceResponse } from '../common/model/service-response';
import { createSingleMulterStorage } from '../common/utils/multerStorage';
import { BannerService } from './banner.service';
import { BannerQueries } from './dto/banner-queries.dto';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @Roles('ROLE_ADMIN')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('url', {
      storage: createSingleMulterStorage(true, true),
    }),
  )
  @ApiResponse({ type: ServiceResponse })
  async create(
    @Body() dto: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    dto.url = `uploads/${file.filename}`;
    if (dto.type !== file.mimetype.split('/')[0]) {
      return ServiceResponse.failure(
        `Media type doesn't match`,
        null,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newBanner = await this.bannerService.create(dto);
    return ServiceResponse.success(
      'Banner added successfully',
      { id: newBanner.id },
      HttpStatus.CREATED,
    );
  }

  @Get()
  @Roles('ROLE_ADMIN')
  @ApiExtraModels(BannerQueries)
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: BannerQueries) {
    const banners = await this.bannerService.findAll(
      plainToInstance(BannerQueries, query),
    );
    return ServiceResponse.success('Got all banners', banners);
  }

  @Get(':id')
  @Roles('ROLE_ADMIN')
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id') id: number) {
    const banner = await this.bannerService.findOne(id);
    if (!banner) {
      return ServiceResponse.failure(
        `Banner #${id} not found`,
        null,
        HttpStatus.NOT_FOUND,
      );
    }
    return ServiceResponse.success(`Found banner #${id}`, banner);
  }

  @Patch(':id')
  @Roles('ROLE_ADMIN')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('url', {
      storage: createSingleMulterStorage(true, true),
    }),
  )
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateBannerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) dto.url = `uploads/${file.filename}`;
    await this.bannerService.update(id, dto);
    return ServiceResponse.success(`Updated banner #${id}`, null);
  }

  @Delete(':id')
  @Roles('ROLE_ADMIN')
  async remove(@Param('id') id: number) {
    await this.bannerService.remove(id);
    return ServiceResponse.success(`Deleted banner #${id}`, null);
  }
}
