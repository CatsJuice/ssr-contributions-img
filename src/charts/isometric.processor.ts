import { CalendarChart3DConfig } from 'src/types/chart-config.interface';
import { generate3dbarAnimation } from './animations/3dbar-animator';
import {
  ContributionDay,
  ContributionWeek,
} from 'src/types/contribution.interface';

function d(pathArr: number[][]) {
  return `M${pathArr.map((p) => `${fix(p[0])},${fix(p[1])}`).join(' ')} z`;
}

function el(
  name: string,
  options: Record<string, any> = {},
  children: string[] = [],
): string {
  return `<${name} ${Object.entries(options)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')}>${children.join('')}</${name}>`;
}

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt('' + (R * (100 + percent)) / 100);
  G = parseInt('' + (G * (100 + percent)) / 100);
  B = parseInt('' + (B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
}

function fix(num, len = 2) {
  return num.toFixed(len);
}

export const isometricProcessor = (
  contributiuonWeeks: ContributionWeek[],
  max: number,
  cfg: CalendarChart3DConfig = {},
) => {
  const { scale, colors, gap, light, gradient } = cfg;
  const weekCount = cfg.weeks;

  const maxHeight = 80;
  const minHeight = 3.2;
  const size = 16;

  const sizeX = 16;
  const sizeY = sizeX / scale;
  const colNum = contributiuonWeeks.length;
  const rowNum = 7;
  const svgWidth = (sizeX + gap) * (colNum + rowNum);
  const svgHeight = (sizeY + gap) * (colNum + rowNum) + maxHeight;
  const translateX = rowNum * (sizeX + gap);
  const translateY = maxHeight;

  const shadeColorLeft = (color) => shadeColor(color, -(15 + light));
  const shadeColorRight = (color) => shadeColor(color, -(5 + light));
  const shadeColorTop = (color) => shadeColor(color, -10 + light);

  // generate gradient defs
  const gradientArr = gradient
    ? colors.slice(1).map((color, index) => {
        const subColors = colors.slice(1, 1 + index + 1).reverse();
        const sides = ['left', 'right'];
        return sides
          .map((side) => {
            return `<linearGradient id="gradient_${side}_${index}" gradientTransform="rotate(90)">
                <stop offset="0%" stop-color="${
                  side === 'left'
                    ? shadeColorLeft(subColors[0])
                    : shadeColorRight(subColors[0])
                }" />
                <stop offset="100%" stop-color="${
                  side === 'left'
                    ? shadeColorLeft(subColors[1] || '')
                    : shadeColorRight(subColors[1] || '')
                }" />
              </linearGradient>`;
          })
          .join('\n');
      })
    : [];

  const coord = (day: ContributionDay) => {
    const i = Math.ceil((day.contributionCount / max) * (colors.length - 1));
    const _h = Math.ceil((day.contributionCount / max) * maxHeight);
    let height = _h ? _h + minHeight : minHeight;
    if (cfg.flatten) {
      height =
        cfg.flatten === 2 ? (minHeight === height ? minHeight : size) : size;
    }
    return {
      level: i,
      color: colors[Math.max(0, Math.min(i, colors.length - 1))],
      height,
    };
  };

  const coordIndex = (rowIndex, colIndex) => [
    (rowIndex - colIndex) * (sizeX + gap),
    (rowIndex + colIndex) * (sizeY + gap),
  ];

  const dayBuilder = (
    contributionDay: ContributionDay,
    weekIndex,
    dayIndex,
  ) => {
    const [ox, oy] = coordIndex(weekIndex, dayIndex);
    const { level, color, height } = coord(contributionDay);

    // const pO = [ox, oy];
    const pA = [ox - sizeX, oy + sizeY];
    const pB = [ox, oy + 2 * sizeY];
    const pC = [ox + sizeX, oy + sizeY];
    const pD = [ox - sizeX, oy - height + sizeY];
    const pE = [ox, oy - height + 2 * sizeY];
    const pF = [ox + sizeX, oy - height + sizeY];
    const pG = [ox, oy - height];

    const face_l = [pE, pD, pA, pB];
    const face_r = [pE, pF, pC, pB];
    const face_t = [pE, pD, pG, pF];

    const info = { 'data-week': weekIndex, 'data-day': dayIndex, class: 'day' };
    const gradientMode =
      gradient && contributionDay.contributionCount && level > 1;
    const fillTop = shadeColorTop(color);
    const fillLeft = gradientMode
      ? `url(#gradient_left_${level - 1})`
      : shadeColorLeft(color);
    const fillRight = gradientMode
      ? `url(#gradient_right_${level - 1})`
      : shadeColorRight(color);
    const gs = [
      { d: d(face_l), fill: fillLeft },
      { d: d(face_r), fill: fillRight },
      { d: d(face_t), fill: fillTop },
    ];
    const paths = gs.map((g) => el('path', g));
    return el('g', info, paths);
  };

  const weekBuilder = (contributiuonWeek: ContributionWeek, weekIndex) => {
    return contributiuonWeek.contributionDays
      .map((day, dayIndex) => dayBuilder(day, weekIndex, dayIndex))
      .join('\n');
  };

  // const svgWidth = fix((weekCount + 7) * (size + gap));
  // const svgHeight = fix((weekCount + 9) * (size / scale + gap) + maxHeight * 2);
  const animation = generate3dbarAnimation(weekCount, cfg, {
    width: svgWidth,
    height: svgHeight,
  });

  return `
    <svg 
      version='1.1' 
      xmlns='http://www.w3.org/2000/svg' 
      xmlns:xlink='http://www.w3.org/1999/xlink' 
      x='0px' 
      y='0px'
      width="${fix(svgWidth)}"
      height="${fix(svgHeight)}"
      viewBox='0 0 ${fix(svgWidth)} ${fix(svgHeight)}' 
      xml:space='preserve'
    >
      <style>${animation}</style>
      <defs>
        ${gradient ? gradientArr.join('\n') : ''}
      </defs>
      <g transform="translate(${translateX},${translateY})">
        ${contributiuonWeeks
          .reverse()
          .map((week, index) => weekBuilder(week, index))
          .join('\n')}
      </g>
    </svg>
  `
    .trim()
    .replace(/[\n|\r]+/g, '\n');
};
