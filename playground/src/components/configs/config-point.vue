<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { computed } from '@vue/reactivity';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});
const emits = defineEmits(['update:modelValue']);

const points = computed(() => {
  return (props.modelValue || '0_0').split('_').map((v) => parseFloat(v));
});

function onChange(index: number, value: any) {
  const p = [...points.value];
  p[index] = value;
  emits('update:modelValue', p.join('_'));
}
</script>

<template name="component-name">
  <div class="row no-wrap items-center q-col-gutter-sm">
    <q-input
      dense
      filled
      type="number"
      :model-value="points[0]"
      label="x"
      @update:model-value="(v) => onChange(0, v)"
    />
    <q-input
      dense
      filled
      type="number"
      :model-value="points[1]"
      label="y"
      @update:model-value="(v) => onChange(1, v)"
    />
  </div>
</template>
