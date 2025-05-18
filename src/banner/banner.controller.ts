import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
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
import { UserRoles } from '../common/enum/user-role.enum';
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
  @Roles(UserRoles.ROLE_ADMIN)
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
      throw new BadRequestException(`Media type doesn't match`);
    }

    const newBanner = await this.bannerService.create(dto);
    return ServiceResponse.success(
      'Banner added successfully',
      { id: newBanner.id },
      HttpStatus.CREATED,
    );
  }

  @Get()
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiExtraModels(BannerQueries)
  @ApiResponse({ type: ServiceResponse })
  async findAll(@Query() query: BannerQueries) {
    const banners = await this.bannerService.findAll(query);
    return ServiceResponse.success('Fetched all banners', banners);
  }

  @Get(':id')
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiResponse({ type: ServiceResponse })
  async findOne(@Param('id') id: number) {
    const banner = await this.bannerService.findOne(id);
    if (!banner) throw new NotFoundException(`Banner #${id} not found`);
    return ServiceResponse.success(`Fetched banner #${id}`, banner);
  }

  @Patch(':id')
  @Roles(UserRoles.ROLE_ADMIN)
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
    await this.findOne(id);
    if (file) dto.url = `uploads/${file.filename}`;
    await this.bannerService.update(id, dto);
    return ServiceResponse.success(`Updated banner #${id} successfully`, null);
  }

  @Delete(':id')
  @Roles(UserRoles.ROLE_ADMIN)
  async remove(@Param('id') id: number) {
    await this.findOne(id);
    await this.bannerService.remove(id);
    return ServiceResponse.success(`Deleted banner #${id} successfully`, null);
  }
}
