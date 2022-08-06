import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify';

async function bootstrap() {
  const logger = new Logger('APP_BOOTSTRAP');
  // const app = await NestFactory.create<NestFastifyApplication>(
  //   AppModule,
  //   new FastifyAdapter(),
  // );
  const app = await NestFactory.create(AppModule);
  const cfgSrv = app.get(ConfigService);

  await app.listen(parseInt(cfgSrv.get('SERVER_PORT')) || 3000, '::');
  logger.log(`App is running on ${await app.getUrl()}`);
}
bootstrap();
