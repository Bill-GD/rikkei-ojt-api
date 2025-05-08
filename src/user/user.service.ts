import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class UserService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async getAll(): Promise<string> {
    // console.log();
    return (await this.knex.raw('select version()'))[0][0] as string;
  }

  getOne(id: number): string {
    return `User ${id}`;
  }
}
