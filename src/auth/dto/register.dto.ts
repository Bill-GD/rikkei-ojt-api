import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'JohnDoe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: '0123456789' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Ha Noi' })
  @IsOptional()
  @IsString()
  address?: string;
}
