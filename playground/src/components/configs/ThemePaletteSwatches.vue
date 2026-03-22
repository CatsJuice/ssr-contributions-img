<script lang="ts" setup>
import { computed, getCurrentInstance } from 'vue';

const props = defineProps({
  colors: {
    type: Array as () => string[],
    default: () => [],
  },
});

const CIRCLE_SIZE = 16;
const OVERLAP = 8;
const CUT_RADIUS = 10.5;

const radius = CIRCLE_SIZE / 2;
const step = CIRCLE_SIZE - OVERLAP;
const svgHeight = CIRCLE_SIZE;
const svgWidth = computed(() =>
  props.colors.length > 0 ? CIRCLE_SIZE + (props.colors.length - 1) * step : 0,
);

const instance = getCurrentInstance();
const maskPrefix = `theme-palette-mask-${instance?.uid ?? '0'}`;

function centerX(index: number) {
  return radius + index * step;
}

function maskId(index: number) {
  return `${maskPrefix}-${index}`;
}
</script>

<template>
  <svg
    v-if="colors.length"
    class="theme-palette-swatches"
    :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
    :width="svgWidth"
    :height="svgHeight"
    aria-hidden="true"
  >
    <defs>
      <mask
        v-for="(_, index) in colors.slice(0, -1)"
        :key="maskId(index)"
        :id="maskId(index)"
        maskUnits="userSpaceOnUse"
        :x="0"
        :y="0"
        :width="svgWidth"
        :height="svgHeight"
      >
        <rect :width="svgWidth" :height="svgHeight" fill="white" />
        <circle
          :cx="centerX(index + 1)"
          :cy="radius"
          :r="CUT_RADIUS"
          fill="black"
        />
      </mask>
    </defs>

    <circle
      v-for="(color, index) in colors"
      :key="`${color}-${index}`"
      :cx="centerX(index)"
      :cy="radius"
      :r="radius"
      :fill="color"
      :mask="index < colors.length - 1 ? `url(#${maskId(index)})` : undefined"
    />
  </svg>
</template>

<style lang="scss" scoped>
.theme-palette-swatches {
  display: block;
  overflow: visible;
}
</style>
