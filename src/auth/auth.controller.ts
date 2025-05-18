import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { ServiceResponse } from '../common/model/service-response';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async register(@Body() dto: RegisterDto) {
    const newUser = await this.authService.register(dto);
    return ServiceResponse.success(
      'User registered successfully',
      { id: newUser.id },
      HttpStatus.CREATED,
    );
  }

  @Post('login')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiResponse({ type: ServiceResponse })
  async login(@Body() dto: LoginDto) {
    const accessToken = await this.authService.login(dto);
    return ServiceResponse.success('Login successfully', { accessToken });
  }
}
