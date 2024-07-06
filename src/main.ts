import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'; // Ensure 'express' is imported using 'import'
import { BACKEND_PORT } from './config'; // Ensure 'BACKEND_PORT' is imported using 'import'

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  app.use(express.json({ limit: '10mb' }));
  app.setGlobalPrefix('api');

  const port = BACKEND_PORT || 3000;

  await app.listen(port);
}

bootstrap();
