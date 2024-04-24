import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { AppModule } from '~/modules/app.module';
import { join } from 'path';
import * as express from 'express';
import { useSwagger } from './swagger/useSwagger';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = app.get(ConfigService).get('PORT') || 5000;
  const STATIC_DIR = app.get(ConfigService).get('STATIC_DIR');

  app.enableCors();
  app.setGlobalPrefix('api/v1');

  if (!existsSync(STATIC_DIR)) {
    mkdirSync(STATIC_DIR, { recursive: true });
  }

  app.use('/files', express.static(join(__dirname, '..', STATIC_DIR)));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  useSwagger(app);

  await app.listen(PORT);
}

bootstrap();
