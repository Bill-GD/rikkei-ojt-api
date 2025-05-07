import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): string {
    return this.userService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number): string {
    return this.userService.getOne(id);
  }
}
