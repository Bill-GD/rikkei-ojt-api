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
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ServiceResponse } from '../common/model/service-response';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@ApiTags('banners')
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: ['image', 'video'],
        },
        position: {
          type: 'string',
        },
      },
      required: ['file', 'type', 'position'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads-banner',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiResponse({ type: ServiceResponse })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBannerDto: CreateBannerDto,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const validTypes = ['image/', 'video/'];
    if (!validTypes.some((type) => file.mimetype.startsWith(type))) {
      throw new Error('Invalid file type. Only image or video allowed.');
    }

    const newBanner = await this.bannerService.create(file, createBannerDto);
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
    return ServiceResponse.success(`Found banner #${id}`, banner);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: ['image', 'video'],
        },
        position: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads-banner',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiResponse({ type: ServiceResponse })
  async update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    await this.bannerService.update(id, updateBannerDto, file);
    return ServiceResponse.success(`Updated banner #${id}`, null);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.bannerService.remove(id);
    return ServiceResponse.success(`Deleted banner #${id}`, null);
  }
}
