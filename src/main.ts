import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

export const PORT = 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS config.
  app.enableCors({
    credentials: true,
    origin: [`http://localhost:${PORT}`],
  });

  // Ensures all endpoints are protected from receiving incorrect data.
  // see: https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(PORT);
}
bootstrap();
