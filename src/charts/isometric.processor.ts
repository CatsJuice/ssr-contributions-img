import { CalendarChart3DConfig } from 'src/types/chart-config.interface';
import {
  ContributionDay,
  ContributionWeek,
} from 'src/types/contribution.interface';

function d(pathArr: number[][]) {
  return `M${pathArr.map((p) => `${fix(p[0])},${fix(p[1])}`).join(' ')} z`;
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
  const weekCount = cfg.weeks;

  const maxHeight = 80;
  const minHeight = 3.2;
  const size = 16;

  const { scale, colors, gap, light, gradient } = cfg;

  const shadeColorLeft = (color) => shadeColor(color, -(15 + light));
  const shadeColorRight = (color) => shadeColor(color, -(5 + light));

  // generate gradient defs
  const gradientArr = colors.slice(1).map((color, index) => {
    const subColors = colors.slice(1, 1 + index + 1).reverse();
    const sides = ['left', 'right'];
    return sides
      .map((side) => {
        return `<linearGradient id="grident_${side}_${index}" gradientTransform="rotate(90)">
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
  });

  const coord = (day: ContributionDay) => {
    const i = Math.ceil((day.contributionCount / max) * (colors.length - 1));
    const _h = Math.ceil((day.contributionCount / max) * maxHeight);
    const height = _h ? _h + minHeight : minHeight;
    return {
      level: i,
      color: colors[Math.max(0, Math.min(i, colors.length - 1))],
      height,
    };
  };

  // generate day path
  const dayBuilder = (contributionDay: ContributionDay, offset) => {
    offset = 6 - offset;
    const coordRes = coord(contributionDay);
    const { level, color } = coordRes;
    let height = coordRes.height;
    if (cfg.flatten) {
      height =
        cfg.flatten === 2 ? (minHeight === height ? minHeight : size) : size;
    }
    const count = contributionDay.contributionCount;
    const appendHeight = (arr) =>
      arr.map((_arr) => [_arr[0], _arr[1] + maxHeight - height]);
    const leftPath = appendHeight([
      [0, size / scale],
      [size, (2 * size) / scale],
      [size, (2 * size) / scale + height],
      [0, size / scale + height],
    ]);
    const topPath = appendHeight([
      [size, 0],
      [2 * size, size / scale],
      [size, (2 * size) / scale],
      [0, size / scale],
    ]);
    const rightPath = appendHeight([
      [size, (2 * size) / scale],
      [2 * size, size / scale],
      [2 * size, size / scale + height],
      [size, (2 * size) / scale + height],
    ]);
    const tx = fix(size * offset + offset * gap);
    const ty = fix((size / scale) * offset + offset * gap);
    let path = '';

    if (gradient && contributionDay.contributionCount && level > 1) {
      path = `
        <path fill='${shadeColor(color, -10 + light)}' d='${d(topPath)}' />
        <path fill='url(#grident_left_${level - 1})' d='${d(leftPath)}' />
        <path fill='url(#grident_right_${level - 1})' d='${d(rightPath)}' />`;
    } else {
      path = `
        <path fill='${shadeColor(color, -10 + light)}' d='${d(topPath)}' />
        <path fill='${shadeColor(color, -(15 + light))}' d='${d(leftPath)}' />
        <path fill='${shadeColor(color, -(5 + light))}' d='${d(rightPath)}' />`;
    }
    return `<g data-count="${count}" transform='scale(1) translate(${tx},-${ty})'>
      ${path}
    </g>`;
  };

  // generate week path
  const weekBuilder = (contributionWeek: ContributionWeek, offset) => {
    const tx = fix(offset * size + offset * gap);
    const ty = fix((size / scale) * offset + offset * gap);
    return `<g class="week" transform="translate(${tx}, ${ty})">
      ${contributionWeek.contributionDays
        .map((day, index) => dayBuilder(day, index))
        .join('\n')}
    </g>`;
  };

  const svgWidth = fix((weekCount + 7) * (size + gap));
  const svgHeight = fix((weekCount + 9) * (size / scale + gap) + maxHeight * 2);

  return `
    <svg 
      version='1.1' 
      xmlns='http://www.w3.org/2000/svg' 
      xmlns:xlink='http://www.w3.org/1999/xlink' 
      x='0px' 
      y='0px'
      width="${svgWidth}"
      height="${svgHeight}"
      viewBox='0 0 ${svgWidth} ${svgHeight}' 
      xml:space='preserve'
    >
      <defs>
        ${gradient ? gradientArr.join('\n') : ''}
      </defs>
      <g class="weeks" transform="translate(0,${maxHeight})">
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
