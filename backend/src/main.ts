import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const PORT = 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS config.
  app.enableCors({
    credentials: true,
    origin: [`http://localhost:${PORT}`, process.env.BASE_URL],
  });

  // Ensures all endpoints are protected from receiving incorrect data.
  // see: https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger config
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Trello Clone API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
