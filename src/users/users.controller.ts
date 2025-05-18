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
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtUserPayload } from '../auth/dto/jwt-user-payload.dto';
import { UserRoles } from '../common/enum/user-role.enum';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { ServiceResponse } from '../common/model/service-response';
import { createSingleMulterStorage } from '../common/utils/multerStorage';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { ApiResponse, ApiConsumes } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Patch(':id/profile')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: createSingleMulterStorage(true, false),
    }),
  )
  @ApiResponse({ type: ServiceResponse })
  async updateProfile(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if ((req.user as JwtUserPayload).sub !== id) {
      throw new ForbiddenException(`User doesn't own the specified account`);
    }

    if (file) dto.avatar = `uploads/${file.filename}`;
    await this.userService.updateProfile(id, dto);
    return ServiceResponse.success(`Updated profile #${id} successfully`, null);
  }

  @Patch('change-password')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async changePassword(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePasswordDto,
  ) {
    if ((req.user as JwtUserPayload).sub !== id) {
      throw new ForbiddenException(`User doesn't own the specified account`);
    }

    await this.userService.changePassword(id, dto);
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
