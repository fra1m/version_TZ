import { DataSource } from 'typeorm';
import { dbConfig } from './db/db.config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const AppDataSource = new DataSource({
  ...dbConfig,
  entities: ['*/**/*.entity.ts'],
  migrations: ['src/migrations/*ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
