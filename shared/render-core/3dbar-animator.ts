import { CalendarChart3DConfig } from './config';
import { Bar3DAnimation } from './enums';

type Args = [
  number,
  CalendarChart3DConfig,
  {
    width: number;
    height: number;
    scopeId: string;
  },
];

export function generate3dbarAnimation(...args: Args) {
  const [weekCount, cfg, options] = args;
  const type = cfg.animation;
  if (!type) return '';

  if (type === Bar3DAnimation.FALL) {
    return fall(...args);
  } else if (type === Bar3DAnimation.RAISE) {
    return raise(...args);
  } else if (type === Bar3DAnimation.WAVE) {
    return wave(...args);
  } else if (type === Bar3DAnimation.MESS) {
    return mess(...args);
  } else if (type === Bar3DAnimation.SPIN) {
    return spin(...args);
  } else if (type === Bar3DAnimation.FADE) {
    return fadeIn(...args);
  } else return '';
}

function fall(...[weekCount, cfg, options]: Args) {
  const selector = `svg[data-render-scope="${options.scopeId}"]`;
  const duration = cfg.animation_duration || 1;
  const delay = cfg.animation_delay || 0.005;
  const distance = options.height || 560;
  const keyframeName = `fall_${options.scopeId}`;
  const delays = [];
  let currentDelay = 0;
  for (let week = 0; week < weekCount; week++) {
    for (let day = 0; day < 7; day++) {
      delays.push(
        `${selector} g[data-week="${week}"][data-day="${day}"] { animation-delay: ${currentDelay}s; }`,
      );
      currentDelay += delay;
    }
  }
  return `${selector} g.day {
      animation: ${keyframeName} ${duration}s ease 0s 1 normal forwards;
      transform: translate(0px, -${distance}px);
    }
    @keyframes ${keyframeName} {
      to { transform: translate(0px, 0px); }
    }
    ${delays.join('\n')}
    `;
}

function raise(...[weekCount, cfg, options]: Args) {
  const selector = `svg[data-render-scope="${options.scopeId}"]`;
  const duration = cfg.animation_duration || 1;
  const delay = cfg.animation_delay || 0.005;
  const distance = options.height || 560;
  const keyframeName = `raise_${options.scopeId}`;
  const delays = [];
  let currentDelay = 0;
  for (let week = weekCount - 1; week >= 0; week--) {
    for (let day = 0; day < 7; day++) {
      delays.push(
        `${selector} g[data-week="${week}"][data-day="${day}"] { animation-delay: ${currentDelay}s; }`,
      );
      currentDelay += delay;
    }
  }
  return `${selector} g.day {
      animation: ${keyframeName} ${duration}s ease 0s 1 normal forwards;
      transform: translate(0px, ${distance}px);
    }
    @keyframes ${keyframeName} {
      to { transform: translate(0px, 0px); }
    }
    ${delays.join('\n')}
    `;
}

function wave(...[weekCount, cfg, options]: Args) {
  const selector = `svg[data-render-scope="${options.scopeId}"]`;
  const duration = cfg.animation_duration || 3;
  const delay = cfg.animation_delay || 0.025;
  const amplitude = cfg.animation_amplitude || 10;
  const keyframeName = `wave_${options.scopeId}`;
  const waveCenter = cfg.animation_wave_center || [];
  const center = [waveCenter[0] || 0, waveCenter[1] || 0];
  const frequency = Math.min(
    0.5,
    Math.max(0.01, cfg.animation_frequency || 0.05),
  );
  const frameGap = frequency * 100;

  const delays = [];
  for (let week = 0; week < weekCount; week++) {
    for (let day = 0; day < 7; day++) {
      const distance = Math.abs(center[0] - week) + Math.abs(center[1] - day);
      delays.push(
        `${selector} g[data-week="${week}"][data-day="${day}"] { animation-delay: ${(
          delay * distance
        ).toFixed(3)}s; }`,
      );
    }
  }
  return `${selector} g.day {
    animation: ${keyframeName} ${duration}s ease 0s infinite normal forwards;
    transform: translate(0px, 0px);
  }
  @keyframes ${keyframeName} {
    ${frameGap}% { transform: translate(0px, -${amplitude}px); }
    ${frameGap * 2}% { transform: translate(0px, 0px); }
  }
  ${delays.join('\n')}
  `;
}

function mess(...[weekCount, cfg, options]: Args) {
  const selector = `svg[data-render-scope="${options.scopeId}"]`;
  const { width, height } = options;
  const loop = cfg.animation_loop || false;
  const duration = loop
    ? (cfg.animation_duration || 3) * 2
    : cfg.animation_duration || 3;

  let style = '';

  for (let week = 0; week < weekCount; week++) {
    for (let day = 0; day < 7; day++) {
      const animName = `mess_${options.scopeId}_${week}_${day}`;
      style += ` ${selector} g[data-week="${week}"][data-day="${day}"] { animation: ${duration}s ${animName} ease; animation-iteration-count: ${
        loop ? 'infinite' : '1'
      };}`;
      const dx = Math.random() > 0.5 ? '' : '-';
      const dy = Math.random() > 0.5 ? '' : '-';
      const tx = `${dx}${(width + Math.random() * 500).toFixed(0)}px`;
      const ty = `${dy}${(height + Math.random() * 500).toFixed(0)}px`;
      const transform = `transform: translate(${tx}, ${ty}) `;
      const transformOrigin = `transform: translate(0, 0)`;
      const breakPoint1 = (20 + Math.random() * 20).toFixed(0);
      const breakPoint2 = (60 + Math.random() * 20).toFixed(0);
      style += ` @keyframes ${animName} { 0% { ${transform}; }`;
      if (loop) {
        style += ` ${breakPoint1}% { ${transformOrigin}; }`;
        style += ` ${breakPoint2}% { ${transformOrigin} }`;
        style += ` 100% { ${transform} }`;
      } else {
        style += ` ${breakPoint1}% { ${transform}; }`;
        style += ` ${breakPoint1}% { ${transformOrigin} }`;
        style += ` 100% { ${transformOrigin} }`;
      }
      style += ' }';
    }
  }

  return style;
}

function spin(...[weekCount, cfg, options]: Args) {
  const selector = `svg[data-render-scope="${options.scopeId}"]`;
  const loop = cfg.animation_loop || false;
  const delay = cfg.animation_delay || 0.01;
  const duration = cfg.animation_duration || 3;
  const keyframeName = `swing_${options.scopeId}`;

  const delays = [];
  for (let week = 0; week < weekCount; week++) {
    for (let day = 0; day < 7; day++) {
      const index = week * 7 + day;
      delays.push(
        `${selector} g[data-week="${week}"][data-day="${day}"] { animation-delay: ${(
          index * delay
        ).toFixed(3)}s; }`,
      );
    }
  }
  return `${selector} * {transform-box: fill-box;}
  ${selector} g.day {
    animation: ${duration}s ${keyframeName};
    transform-origin: center;
    ${loop ? 'animation-iteration-count: infinite;' : ''}
    animation-timing-function: linear;
  }
  @keyframes ${keyframeName} {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  ${delays.join(' ')}
  `;
}

function fadeIn(...[weekCount, cfg, options]: Args) {
  const selector = `svg[data-render-scope="${options.scopeId}"]`;
  const duration = cfg.animation_duration || 0.5;
  const delay = cfg.animation_delay || 0.01;
  const reverse = cfg.animation_reverse || false;
  const keyframeName = `fadeIn_${options.scopeId}`;

  const delays = [];
  const totalTime = delay * (weekCount * 7);
  for (let week = 0; week < weekCount; week++) {
    for (let day = 0; day < 7; day++) {
      const index = week * 7 + day;
      delays.push(
        `${selector} g[data-week="${week}"][data-day="${day}"] { animation-delay: ${(reverse
          ? totalTime - index * delay
          : index * delay
        ).toFixed(3)}s; }`,
      );
    }
  }

  return `${selector} g.day {
    opacity: 0;
    animation: ${duration}s ${keyframeName};
    animation-fill-mode: forwards;
  }
  @keyframes ${keyframeName} {
    from: { opacity: 0 }
    to { opacity: 1 }
  }
  ${delays.join(' ')}
  `;
}
