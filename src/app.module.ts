import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { allConfigs } from './config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsernameExistsGuard } from './guards/username-exists.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.production'],
      isGlobal: true,
      cache: true,
      load: [...allConfigs],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../playground/dist'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UsernameExistsGuard],
})
export class AppModule {}
