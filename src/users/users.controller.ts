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
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRoles } from '../common/enum/user-role.enum';
import { ServiceResponse } from '../common/model/service-response';
import { createSingleMulterStorage } from '../common/utils/multerStorage';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { ApiBearerAuth, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Patch(':id/profile')
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
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) dto.avatar = `uploads/${file.filename}`;

    await this.userService.updateProfile(id, dto);
    return ServiceResponse.success(`Updated profile #${id} successfully`, null);
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
  @Roles(UserRoles.ROLE_ADMIN)
  async getUsers(@Query() query: GetUsersQueryDto) {
    const users = await this.userService.getUsers(query);
    return ServiceResponse.success('Fetched all users', users);
  }

  @Patch(':id/status')
  @Roles(UserRoles.ROLE_ADMIN)
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserStatusDto,
  ) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);

    await this.userService.updateUserStatus(id, dto.status);
    return ServiceResponse.success(`User #${id} is now ${dto.status}`, null);
  }
}
