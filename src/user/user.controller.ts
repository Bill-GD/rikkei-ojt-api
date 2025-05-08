import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<string> {
    return await this.userService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): string {
    return this.userService.getOne(id);
  }
}
