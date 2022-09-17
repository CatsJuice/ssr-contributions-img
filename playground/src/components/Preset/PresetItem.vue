<script lang="ts" setup>
import { PropType } from 'vue';
import { computed } from '@vue/reactivity';

import { validatePath } from '../utils/validatePath';
import { useConfig, ConfigItem } from '../../hooks/useConfig';
import MagicHoverCard from '../base/MagicHoverCard.vue';

const { username, config, locale } = useConfig();

const props = defineProps({
  cfg: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  active: Boolean,
});

const configItems = computed(() => {
  if (!config.value?.length) return [];
  const res: ConfigItem[] = [];

  const checkConfig = (cfg: ConfigItem) => {
    cfg = JSON.parse(JSON.stringify(cfg));
    const { key, optioins } = cfg;

    const subConfig: ConfigItem[] = [];
    if (cfg.type === 'enum' && optioins?.length) {
      const value = props.cfg[key];
      let option;
      for (const item of optioins) {
        if (item.value == value) {
          option = item;
          if (option.config) {
            // option.config.forEach(checkConfig);
            subConfig.push(...option.config);
          }
        }
        delete item.config;
      }
    }

    res.push({
      ...cfg,
      label: cfg.label[locale.value],
      description: cfg.description?.[locale.value],
      optioins: optioins?.map((item) => ({
        ...item,
        label: item.label[locale.value],
      })),
    });
    subConfig.forEach(checkConfig);
  };
  config.value.forEach(checkConfig);
  return res;
});

const query = computed(() => {
  const state = configItems.value.reduce((prev, curr) => {
    const value: any = props.cfg[curr.key] ? `${props.cfg[curr.key]}` : '';
    return value ? { ...prev, [curr.key]: value } : prev;
  }, {} as Record<string, any>);

  state.format = 'svg';
  return state;
});
const queryStr = computed(() => {
  return Object.entries(query.value)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
});

const src = computed(() => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  return validatePath(`${baseURL}/_/${username.value}?${queryStr.value}`);
});
</script>

<template>
  <MagicHoverCard class="preset-item-card">
    <div
      class="preset-item"
      :class="{ active }"
      :style="{ backgroundImage: `url('${src}')` }"
    ></div>
  </MagicHoverCard>
</template>

<style lang="scss">
.preset-item-card {
  width: 140px;
  height: 80px;
  margin-bottom: 7px;
}
.preset-item {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  border: 2px solid transparent;

  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
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

body.body--dark {
  .preset-item {
    background-color: rgba(255, 255, 255, 0.03);
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
}
</style>
