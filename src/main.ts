import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     stopAtFirstError: true,
  //   }),
  // );

  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api`);
  });
}
bootstrap();
