import {
  configureSharpFontEnvironment,
  injectSvgTextFontStyle,
} from './svg-font';

type SharpFactory = typeof import('sharp');
type SharpModule = SharpFactory | { default?: SharpFactory };

export const resolveSharpFactory = (
  sharpModule: SharpModule,
): SharpFactory => {
  if (typeof sharpModule === 'function') {
    return sharpModule;
  }

  if (typeof sharpModule.default === 'function') {
    return sharpModule.default;
  }

  throw new TypeError('Failed to resolve sharp factory from module export');
};

/**
 * Convert svg code to image buffer
 * @param svgCode
 * @param format
 * @param resize
 * @returns
 */
export const svgCode2image = async (
  svgCode: string,
  format: 'png' | 'jpeg',
  resize = 1,
  bg = '#fff',
) => {
  await configureSharpFontEnvironment();
  const rasterizedSvgCode = await injectSvgTextFontStyle(svgCode);
  const sharp = resolveSharpFactory(await import('sharp'));
  const buf = Buffer.from(rasterizedSvgCode);
  return await sharp(buf)
    .metadata()
    .then(({ width }) => {
      let ref = sharp(buf);
      // TODO: add to configuration
      if (format === 'jpeg') ref = ref.flatten({ background: bg });
      return ref
        .toFormat(format)
        .resize(Math.round(width * resize) * 2)
        .toBuffer();
    });
};
