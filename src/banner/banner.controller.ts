import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '../common/model/service-response';
import { createSingleMulterStorage } from '../config/multerStorage';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
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
    const newBanner = await this.bannerService.create(dto);
    return ServiceResponse.success(
      'Banner added successfully',
      { id: newBanner.id },
      StatusCodes.CREATED,
    );
  }

  @Get()
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: any) {
    const banners = await this.bannerService.findAll(query);
    return ServiceResponse.success('Got all banners', banners);
  }

  @Get(':id')
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id') id: number) {
    const banner = await this.bannerService.findOne(id);
    if (!banner) {
      return ServiceResponse.failure(
        `Banner #${id} not found`,
        null,
        StatusCodes.NOT_FOUND,
      );
    }
    return ServiceResponse.success(`Found banner #${id}`, banner);
  }

  @Patch(':id')
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
  async remove(@Param('id') id: number) {
    await this.bannerService.remove(id);
    return ServiceResponse.success(`Deleted banner #${id}`, null);
  }
}
