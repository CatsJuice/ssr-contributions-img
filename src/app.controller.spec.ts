import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './libs/config.constant';

describe('AppController', () => {
  it('should expose the public config schema', async () => {
    const appController = new AppController({} as AppService);

    await expect(appController.getConfig()).resolves.toBe(config);
  });

  it('should expose stroke options for the 3dbar chart config', () => {
    const chartConfig = config.find((item) => item.key === 'chart');
    const bar3dOption = chartConfig?.optioins?.find(
      (option) => option.value === '3dbar',
    );
    const optionKeys = (bar3dOption?.config || []).map((item) => item.key);

    expect(optionKeys).toEqual(
      expect.arrayContaining(['strokeWidth', 'strokeColor']),
    );
  });
});
