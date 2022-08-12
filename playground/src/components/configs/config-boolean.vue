<script lang="ts" setup>
defineProps({
  modelValue: { type: Boolean },
});
defineEmits(['update:modelValue']);
</script>

<template>
  <q-toggle
    dense
    :model-value="modelValue || false"
    @update:model-value="(v) => $emit('update:modelValue', v)"
  ></q-toggle>
</template>
