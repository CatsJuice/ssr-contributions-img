import * as path from 'path';
import { access } from 'fs/promises';
import { mkdir } from 'fs/promises';
import { readFile } from 'fs/promises';
import { writeFile } from 'fs/promises';
import { svgTextFontFamily } from '../../shared/render-core/svg-font';

const embeddedSvgFontFamily = 'SSRCEmbeddedFont';
const embeddedSvgFontFile = path.join('fonts', 'CascadiaCode.ttf');
const fontCacheDir = path.join('/tmp', 'fonts-cache');
const fontConfigPath = path.join('/tmp', 'ssr-contributions-fonts.conf');
export { svgTextFontFamily };

let rasterizationStylePromise: Promise<string> | null = null;
let fontConfigPromise: Promise<void> | null = null;

export const getEmbeddedSvgFontPathCandidates = () => {
  const cwd = process.cwd();
  const dir = __dirname;

  return [...new Set([
    path.resolve(cwd, embeddedSvgFontFile),
    path.resolve(dir, '..', '..', embeddedSvgFontFile),
    path.resolve(dir, '..', '..', '..', embeddedSvgFontFile),
    path.resolve(dir, embeddedSvgFontFile),
  ])];
};

export const resolveEmbeddedSvgFontPath = async () => {
  for (const candidatePath of getEmbeddedSvgFontPathCandidates()) {
    try {
      await access(candidatePath);
      return candidatePath;
    } catch {}
  }

  return null;
};

export const buildFontConfigXml = (fontDir: string) => `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${fontDir}</dir>
  <cachedir>${fontCacheDir}</cachedir>
  <config></config>
</fontconfig>
`;

export const configureSharpFontEnvironment = async () => {
  if (!fontConfigPromise) {
    fontConfigPromise = (async () => {
      const embeddedFontPath = await resolveEmbeddedSvgFontPath();
      if (!embeddedFontPath) return;

      await mkdir(fontCacheDir, { recursive: true });
      await writeFile(
        fontConfigPath,
        buildFontConfigXml(path.dirname(embeddedFontPath)),
      );

      process.env.FONTCONFIG_FILE = fontConfigPath;
      process.env.FONTCONFIG_PATH = path.dirname(fontConfigPath);
    })();
  }

  return fontConfigPromise;
};

const getEmbeddedSvgFontFace = async () => {
  try {
    const embeddedSvgFontPath = await resolveEmbeddedSvgFontPath();
    if (!embeddedSvgFontPath) return '';

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
