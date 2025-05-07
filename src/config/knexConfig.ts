import { Knex } from 'knex';

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      password: process.env.DATABASE_PASSWORD,
      database: '',
    },
  },
};

export default knexConfig;
