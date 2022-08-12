<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';

import { load } from './utils/load';
import { useConfig } from '../hooks/useConfig';

const { selectedTheme, darkMode } = useConfig();
const canvas = ref();

async function draw() {
  clear();
  const colorsMap = selectedTheme.value?.info?.colors || {};
  const colors = (darkMode.value ? colorsMap.dark : colorsMap.light) || [];
  const obelisk = (window as any)['obelisk'];
  const point = new obelisk.Point(27, 28);
  const pixelView = new obelisk.PixelView(canvas.value, point);
  const cube = (options: any) => {
    const { x, y, z, w, l, h, color } = options;
    const dimension = new obelisk.CubeDimension(w, l, h);
    const hex = color.replace(/^#/, '');
    const cubeColor = new obelisk.CubeColor().getByHorizontalColor(
      parseInt(hex, 16),
    );
    const _cube = new obelisk.Cube(dimension, cubeColor);
    const p3d = new obelisk.Point3D(x, y, z);
    pixelView.renderObject(_cube, p3d);
  };
  const s = 12;
  cube({ x: 0, y: 0, z: 0, w: s, l: s, h: 24, color: colors[3] || '#239a3b' });
  cube({ x: 0, y: s, z: 0, w: s, l: s, h: 18, color: colors[2] || '#7bc96f' });
  cube({ x: s, y: 0, z: 0, w: s, l: s, h: 12, color: colors[1] || '#c6e48b' });
  cube({ x: s, y: s, z: 0, w: s, l: s, h: 6, color: colors[0] || '#ebedf0' });
  updateFavicon();
}

function clear() {
  if (!canvas.value) return;
  const ctx = canvas.value.getContext('2d');
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
}

let _obeliskLoaded = false;
async function initObelisk() {
  if (_obeliskLoaded) return;
  await load(
    'https://cdnjs.cloudflare.com/ajax/libs/obelisk.js/1.2.2/obelisk.min.js',
  );
  _obeliskLoaded = true;
}

function updateFavicon() {
  let link: any = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = canvas.value.toDataURL('image/png');
}

watch(
  [() => selectedTheme.value, () => darkMode.value],
  async ([theme]) => {
    if (!theme) return;
    await initObelisk();
    nextTick(draw);
  },
  { immediate: true },
);
</script>

<template>
  <canvas ref="canvas" width="55" height="55"> </canvas>
</template>
