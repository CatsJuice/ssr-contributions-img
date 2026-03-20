<script lang="ts" setup>
import { computed } from '@vue/reactivity';

import PresetItem from './PresetItem.vue';

import { hashObject } from '../utils/has-object';
import { useConfig } from '../../hooks/useConfig';
import { presets as _presets } from './presets.list';

const { locale, state, activeAppearance, usePreset } = useConfig();

const presets = computed(() => {
  return JSON.parse(JSON.stringify(_presets)).map((cfg: any) => ({
    cfg: {
      ...cfg,
      dark: activeAppearance.value.dark,
      ...(activeAppearance.value.colors
        ? {
            colors: activeAppearance.value.colors,
            theme: undefined,
          }
        : {
            theme: activeAppearance.value.theme,
            colors: undefined,
          }),
    },
  }));
});

function isActive(cfg: Record<string, any>) {
  const filter = (v: any) => v !== undefined || v !== null || v !== '';
  return hashObject(state.value, filter) === hashObject(cfg, filter);
}
</script>

<template>
  <div class="config-item-info">
    <div class="config-item-title">
      {{ locale === 'zh' ? '预设' : 'Preset' }}
    </div>
    <div class="config-item-desc">
      {{
        locale === 'zh'
          ? '一些常用的配置组合'
          : 'Common configuration combinations'
      }}
    </div>
  </div>

  <div class="preset-grid">
    <PresetItem
      @click.native="usePreset(cfg)"
      :active="isActive(cfg)"
      v-for="({ cfg }, i) in presets"
      :key="i"
      :cfg="cfg"
    />
  </div>
</template>

<style lang="scss" scoped>
.preset-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
</style>
