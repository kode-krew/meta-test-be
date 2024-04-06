import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // set CORS
  app.enableCors({
    origin:true,
    credentials:true,
    exposedHeaders:['Authorization']
  });
  // set swagger module
  const config = new DocumentBuilder()
    .setTitle('Meta Test API')
    .setDescription('The Meta Test API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());
  // set port
  const port =
    process.env.NODE_ENV === 'dev'
      ? 8000
      : process.env.NODE_ENV === 'production'
        ? 8080
        : 3000;
  await app.listen(port);
}
bootstrap();
