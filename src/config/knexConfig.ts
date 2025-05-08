import { Knex } from 'knex';
import * as process from 'node:process';

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      port: Number(process.env.DATABASE_PORT),
      database: process.env.DATABASE_NAME,
    },
  },
};

export default knexConfig;
