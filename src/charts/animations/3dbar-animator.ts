import { CalendarChart3DConfig } from 'src/types/chart-config.interface';
import { Bar3DAnimation } from '../../types/3dbar-animation.enum';

type Args = [
  number,
  CalendarChart3DConfig,
  {
    width: number; // image-width
    height: number; // image-height
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
  }
}

// function animation(opt: { name: string; delay?: number }) {}

function fall(...[weekCount, cfg, options]: Args) {
  const duration = cfg.animation_duration || 1;
  const delay = cfg.animation_delay || 0.005;
  const distance = options.height || 560;
  const delays = [];
  let _delay = 0;
  for (let week = 0; week < weekCount; week++) {
    for (let day = 0; day < 7; day++) {
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
}

function raise(...[weekCount, cfg, options]: Args) {
  const duration = cfg.animation_duration || 1;
  const delay = cfg.animation_delay || 0.005;
  const distance = options.height || 560;
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
      animation: raise ${duration}s ease 0s 1 normal forwards;
      transform: translate(0px, ${distance}px);
    }
    @keyframes raise {
      to { transform: translate(0px, 0px); }
    }
    ${delays.join('\n')}
    `;
}

function wave(...[weekCount, cfg]: Args) {
  const duration = cfg.animation_duration || 3;
  const delay = cfg.animation_delay || 0.025;
  const amplitude = cfg.animation_amplitude || 10;
  const waveCenter = cfg.animation_wave_center || [];
  const centerDft = [0, 0];
  // const centerDft = [(weekCount - 1) / 2, (7 - 1) / 2]

  const center = [waveCenter[0] || centerDft[0], waveCenter[1] || centerDft[1]];
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
        `g[data-week="${week}"][data-day="${day}"] { animation-delay: ${
          delay * distance
        }s; }`,
      );
    }
  }
  return `g.day {
    animation: wave ${duration}s ease 0s infinite normal forwards;
    transform: translate(0px, 0px);
  }
  @keyframes wave {
    ${frameGap}% { transform: translate(0px, -${amplitude}px); }
    ${frameGap * 2}% { transform: translate(0px, 0px); }
  }
  ${delays.join('\n')}
  `;
}
