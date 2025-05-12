import { Controller , Get , Post, Patch , Delete , Query , Body , Param } from "@nestjs/common";
import { BannerService } from "./banner.service";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";

@Controller("banners")
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  async create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.create(createBannerDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.bannerService.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    return this.bannerService.findOne(id);
  }

  @Patch(":id")
    async update(
        @Param("id") id: number,
        @Body() updateBannerDto: UpdateBannerDto,
    ) {
        return this.bannerService.update(id, updateBannerDto);
    }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return this.bannerService.remove(id);
  }
};