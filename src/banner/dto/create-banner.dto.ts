import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ format: 'binary' })
  @IsOptional()
  @IsString()
  url: string;

  @ApiProperty({ enum: ['image', 'video'] })
  @IsNotEmpty()
  @IsEnum(['image', 'video'])
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  position: string;
}
