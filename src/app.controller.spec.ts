import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './libs/config.constant';

describe('AppController', () => {
  it('should expose the public config schema', async () => {
    const appController = new AppController({} as AppService);

    await expect(appController.getConfig()).resolves.toBe(config);
  });
});
