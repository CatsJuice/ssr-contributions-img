<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import { useQuasar } from 'quasar';

import Display from './components/Display.vue';
import Configuration from './components/Configuration.vue';

import { useConfig } from './hooks/useConfig';

const { activeDarkMode, isMobile, activeTheme } = useConfig();
const $q = useQuasar();

watch(activeDarkMode, (darkMode) => $q.dark.set(darkMode), { immediate: true });

const fallbackBackgroundColors = ['#09111c', '#16324f', '#f3f7fb'];
const fallbackPrimaryColor = '#196027';

function parseHexColor(color: string) {
  const value = `${color || ''}`.trim().replace(/^#/, '');
  if (!value) return null;
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return null;
  const fullHex =
    value.length === 3
      ? value
          .split('')
          .map((item) => `${item}${item}`)
          .join('')
      : value;
  return {
    r: parseInt(fullHex.slice(0, 2), 16),
    g: parseInt(fullHex.slice(2, 4), 16),
    b: parseInt(fullHex.slice(4, 6), 16),
  };
}

function getLuminance(color: string) {
  const rgb = parseHexColor(color);
  if (!rgb) return 0;
  return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
}

function getRelativeLuminance(color: string) {
  const rgb = parseHexColor(color);
  if (!rgb) return 0;
  const toLinear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * toLinear(rgb.r) +
    0.7152 * toLinear(rgb.g) +
    0.0722 * toLinear(rgb.b)
  );
}

function getContrastWithWhite(color: string) {
  return 1.05 / (getRelativeLuminance(color) + 0.05);
}

function buildGradient(colors: string[]) {
  const palette = colors.length ? colors : fallbackBackgroundColors;
  const orderedColors = [...palette].sort(
    (prev, next) => getLuminance(prev) - getLuminance(next),
  );
  const lastIndex = Math.max(orderedColors.length - 1, 1);
  const colorStops = orderedColors.map(
    (color, index) => `${color} ${Math.round((index / lastIndex) * 100)}%`,
  );
  return `linear-gradient(to top right, ${colorStops.join(', ')})`;
}

function buildPrimaryColor(colors: string[]) {
  const palette = colors.filter((color) => parseHexColor(color));
  if (!palette.length) return fallbackPrimaryColor;

  const accessibleColors = palette.filter(
    (color) => getContrastWithWhite(color) >= 4.5,
  );
  const candidates = accessibleColors.length ? accessibleColors : palette;

  return [...candidates].sort(
    (prev, next) =>
      getRelativeLuminance(next) - getRelativeLuminance(prev),
  )[0];
}

const backgroundStyle = computed(() => ({
  '--app-background-gradient': buildGradient(activeTheme.value.colors),
}));
const primaryColor = computed(() => buildPrimaryColor(activeTheme.value.colors));

watch(
  primaryColor,
  (color) => {
    document.body.style.setProperty('--q-primary', color);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  document.body.style.removeProperty('--q-primary');
});
</script>

<template>
  <div
    class="wrapper fit items-center"
    :class="{ dark: activeDarkMode, mobile: isMobile }"
    :style="backgroundStyle"
  >
    <div class="page-background" aria-hidden="true">
      <div class="page-background-gradient"></div>
      <div
        class="page-background-mask"
        :class="{ 'is-dark': activeTheme.dark }"
      ></div>
    </div>
    <Display id="display"></Display>
    <Configuration id="configuration"></Configuration>
  </div>
</template>

<style lang="scss">
#configuration {
  width: 320px;
  flex-shrink: 0;
  background: linear-gradient(to right, #ffffff00 0%, #ffffff40);
}
.dark #configuration {
  background: linear-gradient(to right, #00000000 0%, #00000020 100%);
}

.wrapper {
  display: flex;
  position: relative;
  isolation: isolate;
  overflow: hidden;

  .page-background {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .page-background-gradient,
  .page-background-mask {
    position: absolute;
    inset: 0;
  }

  .page-background-gradient {
    background-color: #060a11;
    background-image: var(--app-background-gradient);
    background-size: cover;
    transform: scale(1.04);
    transform-origin: center;
    transition: background-image 0.35s ease;
  }

  .page-background-mask {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.16),
      rgba(255, 255, 255, 0.1)
    );
    transition: background 0.23s ease;

    &.is-dark {
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.32),
        rgba(0, 0, 0, 0.48)
      );
    }
  }

  > *:not(.page-background) {
    position: relative;
    z-index: 1;
  }

  #display {
    flex-grow: 1;
    width: 0;
  }
  #display,
  #configuration {
    height: 100%;
  }
}

@media screen and(max-width: 768px) {
  #app {
    height: fit-content !important;
  }
  body {
    overflow-y: auto !important;
    top: 0 !important;
  }
  .wrapper.fit {
    flex-direction: column;
    height: fit-content !important;

    #display {
      width: 100%;
      height: 50vh;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1;
    }

    #configuration {
      width: 100%;
      z-index: 2;
      margin-top: 50vh;
      height: fit-content;
      display: block;
      padding-bottom: 60px;

      & > .col-grow.fit-grow {
        height: fit-content;
      }

      /* & > footer {
        background: inherit;
        width: 100%;
        position: fixed;
        bottom: 0;
      } */
    }
  }
}

body.mobile {
  top: 0 !important;
}

body.mobile #configuration {
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  padding-top: 20px;
  position: relative;
  /* drag indicator */
  /* &::after {
    position: absolute;
    content: "";
    top: 10px;
    left: calc(50% - 50px);
    width: 100px;
    height: 4px;
    border-radius: 2px;
    background-color: #ccc;
  } */
}
</style>
