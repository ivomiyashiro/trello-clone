import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ensures all endpoints are protected from receiving incorrect data.
  // see: https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(8080);
}
bootstrap();
