import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { BaseExceptionFilter } from 'src/core/filters/base-exception-filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // set CORS
  app.enableCors({
    origin: ['https://www.meta-cognition.site', 'http://localhost:3000'], // 허용하고자 하는 도메인만 명시
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
    credentials: true,
    exposedHeaders: ['Authorization'],
  });
  // set swagger module
  const config = new DocumentBuilder()
    .setTitle('Meta Test API')
    .setDescription('The Meta Test API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerJson = JSON.stringify(document, null, 2);
  writeFileSync(join(process.cwd(), 'swagger-spec.json'), swaggerJson);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalFilters(new BaseExceptionFilter());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());
  // set port
  const port =
    process.env.NODE_ENV === 'dev'
      ? 8000
      : process.env.NODE_ENV === 'production'
        ? 8080
        : 3000;

  console.log('server start at', port);

  await app.listen(port);
}
bootstrap();
