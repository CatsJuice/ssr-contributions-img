import * as sharp from 'sharp';

/**
 * Convert svg code to image buffer
 * @param svgCode
 * @param format
 * @param resize
 * @returns
 */
export const svgCode2image = async (
  svgCode: string,
  format: string,
  resize = 1,
  bg = '#fff',
) => {
  const buf = Buffer.from(svgCode);
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
