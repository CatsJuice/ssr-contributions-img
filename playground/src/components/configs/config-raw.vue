<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
});

defineEmits(['update:modelValue']);
</script>

<template>
  <q-input
    dense
    filled
    label="Raw text"
    :model-value="modelValue"
    @update:model-value="(v) => $emit('update:modelValue', v)"
  />
</template>
