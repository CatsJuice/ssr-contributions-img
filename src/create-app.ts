import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';

import './utils/echarts-ssr.polyfill';
import { AppModule } from './app.module';

export async function createApp() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/');
  return app;
}
