<script lang="ts" setup>
import { PropType, ref, watch } from 'vue';
import { computed } from '@vue/reactivity';

import { useConfig } from '../../hooks/useConfig';
import type { Locale } from '../../types/config';
import { resolveConfigItems } from '../../utils/config-schema';
import MagicHoverCard from '../base/MagicHoverCard.vue';

const { config, locale, previewDataKey, renderPreviewSvg } = useConfig();

const props = defineProps({
  cfg: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  active: Boolean,
});

const configItems = computed(() => {
  if (!config.value?.length) return [];
  return resolveConfigItems(config.value, props.cfg, locale.value as Locale);
});

function isEmptyValue(value: unknown) {
  return value === undefined || value === null || value === '';
}

const query = computed(() => {
  return configItems.value.reduce((prev, curr) => {
    const value = props.cfg[curr.key];
    if (isEmptyValue(value)) return prev;

    return {
      ...prev,
      [curr.key]: `${value}`,
    };
  }, {} as Record<string, any>);
});
const svgCode = ref('');
let renderToken = 0;

watch(
  [query, previewDataKey],
  async ([nextQuery]) => {
    const token = ++renderToken;
    try {
      const svg = await renderPreviewSvg(nextQuery);
      if (token !== renderToken) return;
      svgCode.value = svg;
    } catch {
      if (token !== renderToken) return;
      svgCode.value = '';
    }
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <MagicHoverCard class="preset-item-card">
    <div class="preset-item" :class="{ active }">
      <div v-if="svgCode" class="preset-item-svg" v-html="svgCode"></div>
      <q-skeleton
        v-else
        class="preset-item-skeleton"
        animation="fade"
        width="100%"
        height="100%"
      />
    </div>
  </MagicHoverCard>
</template>

<style lang="scss">
.preset-item-card {
  width: 100%;
  aspect-ratio: 7 / 4;
}
.preset-item {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: background-color 0.23s ease, transform 0.1s ease-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    transform: scale(1.02);
  }
  &.active {
    border-color: var(--q-primary);
  }
}

.preset-item-svg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  & > svg {
    display: block;
    width: 100%;
    height: 100%;
    max-width: calc(100% - 16px);
    max-height: calc(100% - 16px);
  }
}

.preset-item-skeleton {
  opacity: 0.35;
}

body.body--dark {
  .preset-item {
    background-color: rgba(255, 255, 255, 0.03);
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
}
</style>
