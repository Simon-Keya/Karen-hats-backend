import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config'; // Load environment variables
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  
  // Enable CORS if your API is accessed from a different domain
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Karen Hats E-commerce API')
    .setDescription('The API for managing Karen Hats e-commerce')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the server on the specified port or default to 3000
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
