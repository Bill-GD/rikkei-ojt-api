import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere, Like, Not, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';

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

    // const updatedUser = await this.userRepo.findOne({
    //   where: { id: userId },
    //   select: [
    //     'id',
    //     'first_name',
    //     'last_name',
    //     'email',
    //     'avatar',
    //     'phone',
    //     'address',
    //     'created_at',
    //     'updated_at',
    //     'status',
    //   ],
    // });
    //
    // return updatedUser;
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) throw new UnauthorizedException('Old password is incorrect');

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);
  }

  async getUsers(query: GetUsersQueryDto) {
    query = plainToInstance(GetUsersQueryDto, query);
    const { search = '', first_name, last_name, email, phone, address } = query;

    let where: FindOptionsWhere<User>[] | FindOptionsWhere<User>;

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

    const users = await this.userRepo.find({
      where,
      order: query.sort ? { [query.sort]: query.getOrder() } : undefined,
      skip: query.getOffset(),
      take: query.getLimit(),
    });

    // for (const user of users) {
    //   user.role = user.role.role.role_name;
    // }
    return users;
  }

  findOne(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  async updateUserStatus(id: number, status: 'ACTIVE' | 'BLOCKED') {
    const user = (await this.findOne(id))!;
    user.status = status;
    await this.userRepo.update(id, user);
  }
}
