import * as dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

export const dbConfig = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: String(process.env.POSTGRES_PASSWORD),
  database: process.env.POSTGRES_DB,
};
