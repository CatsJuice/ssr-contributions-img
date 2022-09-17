<script lang="ts" setup>
import { computed } from '@vue/reactivity';

import PresetItem from './PresetItem.vue';

import { hashObject } from '../utils/has-object';
import { useConfig } from '../../hooks/useConfig';
import { presets as _presets } from './presets.list';

const { locale, state, darkMode, usePreset } = useConfig();

const presets = computed(() => {
  return JSON.parse(JSON.stringify(_presets)).map((cfg: any) => ({
    cfg: { ...cfg, dark: darkMode.value },
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

  <div class="row justify-between q-mb-md q-pb-md">
    <PresetItem
      @click.native="usePreset(cfg)"
      :active="isActive(cfg)"
      v-for="({ cfg }, i) in presets"
      :key="i"
      :cfg="cfg"
    />
  </div>
</template>
