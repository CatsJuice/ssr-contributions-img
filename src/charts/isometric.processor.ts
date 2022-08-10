import { CalendarChart3DConfig } from 'src/types/chart-config.interface';
import { Bar3DAnimation } from '../types/3dbar-animation.enum';
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

function generateAnimation(weekCount: number, cfg: CalendarChart3DConfig) {
  const type = cfg.animation;
  if (!type) return '';
  const duration = cfg.animation_duration || 1;
  const delay = cfg.animation_delay || 0.005;
  const distance = cfg.animation_distance || 560;

  if (type === Bar3DAnimation.FALL) {
    const delays = [];
    let _delay = 0;
    for (let week = 0; week < weekCount; week++) {
      for (let day = 6; day >= 0; day--) {
        delays.push(
          `g[data-week="${week}"][data-day="${day}"] { animation-delay: ${_delay}s; }`,
        );
        _delay += delay;
      }
    }
    return `g.day {
      animation: fall ${duration}s ease 0s 1 normal forwards;
      transform: translate(0px, -${distance}px);
    }
    @keyframes fall {
      to { transform: translate(0px, 0px); }
    }
    ${delays.join('\n')}
    `;
  } else if (type === Bar3DAnimation.RAISE) {
    const delays = [];
    let _delay = 0;
    for (let week = weekCount - 1; week >= 0; week--) {
      for (let day = 0; day < 7; day++) {
        delays.push(
          `g[data-week="${week}"][data-day="${day}"] { animation-delay: ${_delay}s; }`,
        );
        _delay += delay;
      }
    }
    return `g.day {
      animation: fall ${duration}s ease 0s 1 normal forwards;
      transform: translate(0px, ${distance}px);
    }
    @keyframes fall {
      to { transform: translate(0px, 0px); }
    }
    ${delays.join('\n')}
    `;
  }
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
  const dayBuilder = (contributionDay: ContributionDay, offset, week) => {
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
      <g class="day" data-week="${week}" data-day="${offset}">${path}</g>
    </g>`;
  };

  // generate week path
  const weekBuilder = (contributionWeek: ContributionWeek, offset) => {
    const tx = fix(offset * size + offset * gap);
    const ty = fix((size / scale) * offset + offset * gap);
    return `<g class="week" transform="translate(${tx}, ${ty})">
      ${contributionWeek.contributionDays
        .map((day, index) => dayBuilder(day, index, offset))
        .join('\n')}
    </g>`;
  };

  const svgWidth = fix((weekCount + 7) * (size + gap));
  const svgHeight = fix((weekCount + 9) * (size / scale + gap) + maxHeight * 2);
  const animation = generateAnimation(weekCount, cfg);

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
      <style>${animation}</style>
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
