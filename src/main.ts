import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
