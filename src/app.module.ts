import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { allConfigs } from './config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PlaygroundAccessGuard } from './guards/playground-access.guard';
import { UsernameExistsGuard } from './guards/username-exists.guard';
import { GithubContributionsService } from './services/github-contributions.service';
import { PlaygroundRateLimitService } from './services/playground-rate-limit.service';
import { resolvePlaygroundDistPath } from './utils/resolve-playground-dist';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.production'],
      isGlobal: true,
      cache: true,
      load: [...allConfigs],
    }),
    ServeStaticModule.forRoot({
      rootPath: resolvePlaygroundDistPath(__dirname),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GithubContributionsService,
    PlaygroundAccessGuard,
    PlaygroundRateLimitService,
    UsernameExistsGuard,
  ],
})
export class AppModule {}
