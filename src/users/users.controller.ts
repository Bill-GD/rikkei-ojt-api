import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import multerStorage from '../config/multerStorage';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
  })
  @UseInterceptors(FileInterceptor('avatar', { storage: multerStorage }))
  updateProfile(
    @Req() req,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatarPath = file ? `uploads/${file.filename}` : undefined;
    return this.userService.updateProfile(req.user.sub, dto, avatarPath);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Đổi mật khẩu thành công',
  })
  changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.sub, dto);
  }
}
