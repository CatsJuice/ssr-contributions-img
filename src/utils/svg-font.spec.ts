import { injectSvgTextFontStyle, svgTextFontFamily } from './svg-font';

describe('injectSvgTextFontStyle', () => {
  it('should inject a rasterization font style into svg markup', async () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="32"><text x="0" y="16">图例</text></svg>';
    const result = await injectSvgTextFontStyle(svg);

    expect(result).toContain('<style type="text/css">');
    expect(result).toContain('@font-face');
    expect(result).toContain(`font-family:${svgTextFontFamily} !important;`);
    expect(result).toContain('<text x="0" y="16">图例</text>');
  });

  it('should leave non-svg content untouched', async () => {
    expect(await injectSvgTextFontStyle('plain text')).toBe('plain text');
  });
});
