import * as path from 'path';
import { readFile } from 'fs/promises';

const embeddedSvgFontFamily = 'SSRCEmbeddedFont';
const embeddedSvgFontPath = path.resolve(
  process.cwd(),
  'fonts',
  'CascadiaCode.ttf',
);

export const svgTextFontFamily = [
  embeddedSvgFontFamily,
  'Cascadia Code',
  'CascadiaCode',
  'Noto Sans CJK SC',
  'Noto Sans SC',
  'Source Han Sans SC',
  'PingFang SC',
  'Hiragino Sans GB',
  'Microsoft YaHei',
  'Heiti SC',
  'Arial Unicode MS',
  'WenQuanYi Micro Hei',
  'sans-serif',
].join(', ');

let rasterizationStylePromise: Promise<string> | null = null;

const getEmbeddedSvgFontFace = async () => {
  try {
    const fontBuffer = await readFile(embeddedSvgFontPath);
    return `@font-face{font-family:${embeddedSvgFontFamily};src:url("data:font/ttf;base64,${fontBuffer.toString(
      'base64',
    )}") format("truetype");font-style:normal;font-weight:400;}`;
  } catch {
    return '';
  }
};

const getRasterizationStyle = async () => {
  if (!rasterizationStylePromise) {
    rasterizationStylePromise = getEmbeddedSvgFontFace().then(
      (embeddedFontFace) =>
        `${embeddedFontFace}text,tspan{font-family:${svgTextFontFamily} !important;}`,
    );
  }
  return rasterizationStylePromise;
};

export const injectSvgTextFontStyle = async (svgCode: string) => {
  const svgTagMatch = svgCode.match(/<svg\b[^>]*>/i);
  if (!svgTagMatch) return svgCode;

  const rasterizationStyle = await getRasterizationStyle();
  const svgTag = svgTagMatch[0];
  const svgTagIndex = svgTagMatch.index || 0;
  const injectIndex = svgTagIndex + svgTag.length;

  return `${svgCode.slice(
    0,
    injectIndex,
  )}<style type="text/css">${rasterizationStyle}</style>${svgCode.slice(
    injectIndex,
  )}`;
};
