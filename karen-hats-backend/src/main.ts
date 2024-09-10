import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config'; // Load environment variables
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS for external access
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // Allow all by default or restrict with env var
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Set global API prefix (optional)
  app.setGlobalPrefix('api/v1');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Karen Hats E-commerce API')
    .setDescription('The API for managing Karen Hats e-commerce')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI setup, customizable with env var
  const swaggerPath = process.env.SWAGGER_PATH || 'api';
  SwaggerModule.setup(swaggerPath, app, document);

  // Start the application
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
