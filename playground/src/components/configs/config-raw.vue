<script lang="ts" setup>
import { computed } from '@vue/reactivity';

import { useConfig } from '../../hooks/useConfig';

const { locale } = useConfig();

const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  modelValue: {
    type: [String, Number],
  },
});

const label = computed(() => {
  if (props.type === 'colors') {
    return locale.value === 'zh'
      ? '十六进制颜色，使用“,”分隔'
      : 'Hex colors joined by ","';
  }

  if (props.type === 'color') {
    return locale.value === 'zh'
      ? '颜色值，例如 111827'
      : 'Color value, e.g. 111827';
  }

  return locale.value === 'zh' ? '文本' : 'Text';
});

defineEmits(['update:modelValue']);
</script>

<template>
  <q-input
    dense
    filled
    :label="label"
    :model-value="modelValue"
    @update:model-value="(v) => $emit('update:modelValue', v)"
  />
</template>
