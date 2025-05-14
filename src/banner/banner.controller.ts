import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Banners')
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

    return this.bannerService.create(file, createBannerDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.bannerService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.bannerService.findOne(id);
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
  async update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBannerDto: UpdateBannerDto,
  ) {
    return this.bannerService.update(id, updateBannerDto, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.bannerService.remove(id);
  }
}
