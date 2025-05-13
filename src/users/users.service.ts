import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from 'src/entities/user/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
    avatarPath?: string,
  ) {
    if (dto.email) {
      const existed = await this.userRepo.findOne({
        where: { email: dto.email, id: Not(userId) },
      });
      if (existed) {
        throw new ConflictException('Email is already in use');
      }
    }

    const updateData: Partial<User> = {
      ...dto,
      updated_at: new Date(),
    };

    if (avatarPath) {
      updateData.avatar = avatarPath;
    }

    await this.userRepo.update(userId, updateData);

    const updatedUser = await this.userRepo.findOne({
      where: { id: userId },
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'avatar',
        'phone',
        'address',
        'created_at',
        'updated_at',
        'status',
      ],
    });

    return updatedUser;
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) throw new UnauthorizedException('Old password is incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashed;
    user.updated_at = new Date();
    await this.userRepo.save(user);
  }
}
