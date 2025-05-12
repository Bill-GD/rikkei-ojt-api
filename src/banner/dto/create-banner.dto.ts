import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BannerType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export class CreateBannerDto {
  @ApiProperty({ example: 'https://example.com/banner.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ enum: BannerType })
  @IsEnum(BannerType)
  type: BannerType;

  @ApiProperty({ example: 'top' })
  @IsString()
  @IsNotEmpty()
  position: string;
}
