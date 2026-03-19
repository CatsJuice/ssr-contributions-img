import {
  buildFontConfigXml,
  configureSharpFontEnvironment,
  getEmbeddedSvgFontPathCandidates,
  injectSvgTextFontStyle,
  resolveEmbeddedSvgFontPath,
  svgTextFontFamily,
} from './svg-font';

describe('injectSvgTextFontStyle', () => {
  it('should probe font paths from cwd and compiled locations', () => {
    const candidates = getEmbeddedSvgFontPathCandidates();

    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates.some((item) => item.endsWith('fonts/CascadiaCode.ttf'))).toBe(
      true,
    );
    expect(new Set(candidates).size).toBe(candidates.length);
  });

  it('should build a fontconfig file for the embedded font directory', () => {
    const xml = buildFontConfigXml('/var/task/fonts');

    expect(xml).toContain('<dir>/var/task/fonts</dir>');
    expect(xml).toContain('<cachedir>/tmp/fonts-cache</cachedir>');
  });

  it('should configure fontconfig env vars when the embedded font exists', async () => {
    const embeddedFontPath = await resolveEmbeddedSvgFontPath();

    expect(embeddedFontPath).toBeTruthy();
    await configureSharpFontEnvironment();

    expect(process.env.FONTCONFIG_FILE).toBe('/tmp/ssr-contributions-fonts.conf');
    expect(process.env.FONTCONFIG_PATH).toBe('/tmp');
  });

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
