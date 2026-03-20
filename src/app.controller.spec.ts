import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './libs/config.constant';

describe('AppController', () => {
  it('should expose the public config schema', async () => {
    const appController = new AppController({} as AppService);

    await expect(appController.getConfig()).resolves.toBe(config);
  });

  it('should expose stroke and legend options for the 3dbar chart config', () => {
    const chartConfig = config.find((item) => item.key === 'chart');
    const bar3dOption = chartConfig?.optioins?.find(
      (option) => option.value === '3dbar',
    );
    const optionKeys = (bar3dOption?.config || []).map((item) => item.key);

    expect(optionKeys).toEqual(
      expect.arrayContaining([
        'legend',
        'legendPosition',
        'legendDirection',
        'foregroundColor',
        'strokeWidth',
        'strokeColor',
      ]),
    );
  });

  it('should expose panel metadata and the random theme option', () => {
    const themeConfig = config.find((item) => item.key === 'theme');
    const chartConfig = config.find((item) => item.key === 'chart');
    const bar3dOption = chartConfig?.optioins?.find(
      (option) => option.value === '3dbar',
    );
    const animationConfig = bar3dOption?.config?.find(
      (item) => item.key === 'animation',
    );
    const waveOption = animationConfig?.optioins?.find(
      (option) => option.value === 'wave',
    );

    expect(themeConfig?.panel).toMatchObject({
      tab: { key: 'general' },
      group: { key: 'general-theme' },
    });
    expect(themeConfig?.optioins?.some((option) => option.value === 'random')).toBe(
      true,
    );

    expect(animationConfig?.panel).toMatchObject({
      tab: { key: 'animation' },
      group: { key: 'animation-mode' },
    });
    expect((waveOption?.config || []).every((item) => item.panel?.group.key === 'animation-wave')).toBe(
      true,
    );
  });
});
