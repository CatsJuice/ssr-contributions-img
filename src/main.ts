import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createApp } from './create-app';

// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify';

async function bootstrap() {
  const logger = new Logger('APP_BOOTSTRAP');
  // const app = await createApp<NestFastifyApplication>(
  //   AppModule,
  //   new FastifyAdapter(),
  // );
  const app = await createApp();
  const cfgSrv = app.get(ConfigService);

  await app.listen(parseInt(cfgSrv.get('SERVER_PORT')) || 3000, '::');
  logger.log(`App is running on ${await app.getUrl()}`);
}
bootstrap();
