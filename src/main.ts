import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationExceptionFilter } from './decorator/validation';

async function bootstrap() {
  const PORT = 8000;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Quick Shop API')
    .setDescription(
      'The "Quick Shop API" project aims to develop a complete set of RESTful APIs for an online shopping store. The primary goal is to provide easy-to-use, quickly deployable APIs that fully meet the requirements of an e-commerce system.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'authorization',
    )
    // .addTag('Products', 'Operations related to product management.')
    // .addTag('Cart', 'Operations for managing the shopping cart.')
    // .addTag('Orders', 'Operations for handling customer orders.')
    // .addTag('Users', 'User authentication and management operations.')
    // .addTag('Reviews', 'Operations for managing product reviews and ratings.')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Chỉ nhận các trường được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Từ chối các trường không được định nghĩa trong DTO
      transform: true, // Tự động chuyển đổi kiểu dữ liệu cho đúng với DTO

      exceptionFactory: (validationErrors = []) => {
        const errors = validationErrors.map((error) => {
          return {
            field: error.property,
            message: Object.values(error.constraints),
          };
        });
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          data: null,
          errors,
        });
      },
    }),
  );
  app.enableCors({
    origin: 'http://localhost:5173', // Địa chỉ frontend của bạn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Cho phép cookies nếu cần);
  });
  app.useGlobalFilters(new ValidationExceptionFilter());
  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api`);
  });
}
bootstrap();
