import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../../common/enum/user-status.enum';

export class UpdateUserStatusDto {
  @ApiProperty({
    enum: UserStatus,
    enumName: 'UserStatus',
    description: 'Trạng thái người dùng',
    example: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus)
  status: UserStatus;
}
