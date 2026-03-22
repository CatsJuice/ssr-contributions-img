import { normalizeRenderConfig } from '../../shared/render-core/normalize';

describe('normalizeRenderConfig', () => {
  it('should normalize raw hex stroke and foreground colors like the server dto', () => {
    const config = normalizeRenderConfig({
      chart: '3dbar' as any,
      strokeColor: '222222',
      foregroundColor: 'ff00aa',
    });

    expect(config.strokeColor).toBe('#222222');
    expect(config.foregroundColor).toBe('#ff00aa');
  });

  it('should preserve non-hex css color strings', () => {
    const config = normalizeRenderConfig({
      chart: '3dbar' as any,
      strokeColor: 'white',
      foregroundColor: 'rgb(255, 0, 170)',
    });

    expect(config.strokeColor).toBe('white');
    expect(config.foregroundColor).toBe('rgb(255, 0, 170)');
  });
});
