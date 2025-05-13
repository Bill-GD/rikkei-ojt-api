import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '../common/model/service-response';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({ type: ServiceResponse })
  async register(@Body() dto: RegisterDto) {
    const newUser = await this.authService.register(dto);
    return ServiceResponse.success(
      'User registered successfully',
      { id: newUser.id },
      StatusCodes.CREATED,
    );
  }

  @Post('login')
  @ApiResponse({ type: ServiceResponse })
  async login(@Body() dto: LoginDto) {
    const accessToken = await this.authService.login(dto);
    return ServiceResponse.success('Login successfully', { accessToken });
  }
}
