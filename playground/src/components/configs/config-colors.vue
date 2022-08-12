<script lang="ts" setup>
import { computed } from '@vue/reactivity';

const maxColors = 10;
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});
const emits = defineEmits(['update:modelValue']);

const colorsArray = computed(() => {
  return props.modelValue.split(',').map((v) => `#${v}`);
});
</script>

<template>
  <q-input
    label="(TDDO)"
    dense
    filled
    type="text"
    :model-value="modelValue"
    @update:model-value="(v) => $emit('update:modelValue', v)"
  />
</template>
