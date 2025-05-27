import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [process.env.CORS_ORIGIN || 'http://localhost:5173'],
      credentials: true,
    }
  });
  app.use('/static', express.static(join(process.cwd(), 'data')));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
