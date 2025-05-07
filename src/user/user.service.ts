import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class UserService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  getAll(): string {
    // return this.knex('user').select('*');
    return 'All users';
  }

  getOne(id: number): string {
    return `User ${id}`;
  }
}
