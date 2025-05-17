import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Old password of the user',
    example: 'oldpassword123',
    required: true,
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'New password of the user',
    example: 'newpassword123',
    required: true,
  })
  @IsString()
  @Length(6, 32)
  newPassword: string;
}
