import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Category } from 'src/category/entities/category.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: 'localhost',
  port: 1433,
  username: 'SA',
  password: 'T.a07082003',
  database: 'quick-shop',
  entities: [Category, User],
  synchronize: true,
  extra: {
    trustServerCertificate: true,
  },
};
