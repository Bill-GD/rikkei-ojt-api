import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Like, FindOptionsWhere } from 'typeorm';
import { User } from 'src/entities/user/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { GetUsersQueryDto } from './dto/get-users-query.dto';

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

  async getUsers(query: GetUsersQueryDto) {
    const {
      search = '',
      order = 'DESC',
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      first_name,
      last_name,
      email,
      phone,
      address,
    } = query;

    const skip = (page - 1) * limit;

    let where: FindOptionsWhere<User>[] | FindOptionsWhere<User> = {};

    if (search) {
      where = [
        { first_name: Like(`%${search}%`) },
        { last_name: Like(`%${search}%`) },
        { email: Like(`%${search}%`) },
        { phone: Like(`%${search}%`) },
        { address: Like(`%${search}%`) },
      ];
    } else {
      where = {};
      if (first_name) where.first_name = Like(`%${first_name}%`);
      if (last_name) where.last_name = Like(`%${last_name}%`);
      if (email) where.email = Like(`%${email}%`);
      if (phone) where.phone = Like(`%${phone}%`);
      if (address) where.address = Like(`%${address}%`);
    }

    const [users, total] = await this.userRepo.findAndCount({
      where,
      order: { [sort_by]: order },
      skip,
      take: limit,
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'avatar',
        'phone',
        'address',
        'status',
        'created_at',
        'updated_at',
      ],
    });

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async getUsers(query: GetUsersQueryDto) {
    const {
      search = '',
      order = 'DESC',
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      first_name,
      last_name,
      email,
      phone,
      address,
    } = query;

    const skip = (page - 1) * limit;

    let where: FindOptionsWhere<User>[] | FindOptionsWhere<User> = {};

    if (search) {
      where = [
        { first_name: Like(`%${search}%`) },
        { last_name: Like(`%${search}%`) },
        { email: Like(`%${search}%`) },
        { phone: Like(`%${search}%`) },
        { address: Like(`%${search}%`) },
      ];
    } else {
      where = {};
      if (first_name) where.first_name = Like(`%${first_name}%`);
      if (last_name) where.last_name = Like(`%${last_name}%`);
      if (email) where.email = Like(`%${email}%`);
      if (phone) where.phone = Like(`%${phone}%`);
      if (address) where.address = Like(`%${address}%`);
    }

    const [users, total] = await this.userRepo.findAndCount({
      where,
      order: { [sort_by]: order },
      skip,
      take: limit,
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'avatar',
        'phone',
        'address',
        'status',
        'created_at',
        'updated_at',
      ],
    });

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async updateUserStatus(userId: number, status: 'ACTIVE' | 'BLOCKED') {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    user.status = status;
    user.updated_at = new Date();
    await this.userRepo.save(user);
  }
}
