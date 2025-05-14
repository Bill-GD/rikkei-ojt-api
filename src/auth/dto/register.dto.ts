import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  phone?: string;

  @IsString()
  address?: string;
}
