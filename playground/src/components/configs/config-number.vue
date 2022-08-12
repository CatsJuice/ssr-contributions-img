<script lang="ts" setup>
import { useConfig } from '../../hooks/useConfig';
import { computed } from '@vue/reactivity';

const { locale } = useConfig();
const props = defineProps({
  modelValue: {
    type: [String, Number],
  },
  type: {
    type: String,
    default: 'int',
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 10000,
  },
});
const emits = defineEmits(['update:modelValue']);

const label = computed(() => {
  const min = props.min;
  const max = props.max;

  const l = (num: number) =>
    Object.prototype.toString.call(num) === '[object Number]' ? num : '-';

  if (locale.value === 'zh') {
    return `在 ${l(min)} 到 ${l(max)} 之间的${
      props.type === 'int' ? '整数' : '数字'
    }`;
  }
  return `${props.type} between ${l(min)} and ${l(max)}`;
});

function onInput(val: string | number | null) {
  const fitMinMax = (v: number) => {
    if (props.min) v = Math.max(v, props.min);
    if (props.max) v = Math.min(v, props.max);
    return v;
  };
  if (props.type === 'int') {
    const num = fitMinMax(parseInt(val + '', 10));
    if (!isNaN(num)) {
      emits('update:modelValue', num + '');
    }
  } else {
    const num = fitMinMax(parseFloat(val + ''));
    emits('update:modelValue', `${num}`);
  }
}
</script>

<template>
  <q-input
    type="number"
    :label="label"
    dense
    filled
    :model-value="modelValue"
    @update:model-value="onInput"
  >
  </q-input>
</template>
