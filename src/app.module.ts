import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { databaseConfig } from 'src/database.config';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from 'src/middleware/LoggerMiddleware';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), CategoryModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit, NestModule {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      console.log('Database connection established successfully!');
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
