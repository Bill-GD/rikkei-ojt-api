import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateBannerDto {
  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  @IsIn(['image', 'video'])
  type: string;
}
