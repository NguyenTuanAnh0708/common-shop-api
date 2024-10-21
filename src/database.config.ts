import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: 'localhost',
  port: 1433,
  username: 'SA',
  password: 'T.a07082003',
  database: 'common-shop',
  entities: [Category],
  synchronize: true,
  extra: {
    trustServerCertificate: true,
  },
};
