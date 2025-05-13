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
import { ServiceResponse } from '../common/model/service-response';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import multerStorage from '../config/multerStorage';
import {
  ApiTags,
  ApiBearerAuth,
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
  @UseInterceptors(FileInterceptor('avatar', { storage: multerStorage }))
  @ApiResponse({ type: ServiceResponse })
  async updateProfile(
    @Req() req,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatarPath = file ? `uploads/${file.filename}` : undefined;
    const updatedUser = await this.userService.updateProfile(
      req.user.sub,
      dto,
      avatarPath,
    );
    return ServiceResponse.success('Profile updated successfully', {
      updatedUser,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ type: ServiceResponse })
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    await this.userService.changePassword(req.user.sub, dto);
    return ServiceResponse.success('Password changed successfully', null);
  }
}
