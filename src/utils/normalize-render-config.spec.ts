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

  it('should normalize raw hex background colors like the server dto', () => {
    const config = normalizeRenderConfig({
      chart: 'calendar' as any,
      backgroundColor: '111827',
    });

    expect(config.backgroundColor).toBe('#111827');
  });

  it('should preserve non-hex css background colors', () => {
    const config = normalizeRenderConfig({
      chart: 'calendar' as any,
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
    });

    expect(config.backgroundColor).toBe('rgba(17, 24, 39, 0.9)');
  });
});
