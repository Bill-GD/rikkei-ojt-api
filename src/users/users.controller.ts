import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Req,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ServiceResponse } from '../common/model/service-response';
import { createSingleMulterStorage } from '../common/utils/multerStorage';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: createSingleMulterStorage(true, false),
    }),
  )
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

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    await this.userService.changePassword(req.user.sub, dto);
    return ServiceResponse.success('Password changed successfully', null);
  }

  @Get()
  @Roles('ROLE_ADMIN')
  async getUsers(@Query() query: GetUsersQueryDto) {
    const { data } = await this.userService.getUsers(query);
    return ServiceResponse.success('Fetched all users', data);
  }

  @Patch(':id/status')
  @Roles('ROLE_ADMIN')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserStatusDto,
  ) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);

    await this.userService.updateUserStatus(id, dto.status);
    return ServiceResponse.success(
      `Updated status of user #${id} successfully`,
      null,
    );
  }
}
