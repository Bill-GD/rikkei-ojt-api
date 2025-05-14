import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ format: 'binary', required: false })
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
