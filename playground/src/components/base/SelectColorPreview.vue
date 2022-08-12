<script lang="ts" setup>
import { PropType } from 'vue';

defineProps({
  colors: Array as PropType<string[]>,
});
</script>

<template>
  <div class="colors-preview">
    <div
      class="color"
      v-for="(color, index) in colors"
      :key="index"
      :style="`--color: ${color}`"
    ></div>
  </div>
</template>

<style lang="scss">
.colors-preview {
  position: relative;
  height: 100%;

  .color {
    top: 50%;
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--color);
  }

  @for $i from 1 through 10 {
    .color:nth-last-child(#{$i}) {
      transform: translateY(-50%) translateX(-#{$i * 8}px);
      z-index: 10 - #{$i};
      opacity: #{1 - ($i - 1) * 0.15};
    }
  }
}
</style>
