<script lang="ts" setup>
defineProps({
  modelValue: { type: Boolean },
});
defineEmits(['update:modelValue']);
</script>

<template>
  <q-toggle
    class="config-boolean"
    dense
    :model-value="modelValue || false"
    @update:model-value="(v) => $emit('update:modelValue', v)"
  ></q-toggle>
</template>

<style lang="scss">
.config-boolean {
  &.q-toggle--dense .q-toggle__inner {
    padding: 0;
  }

  .q-toggle__track {
    height: 0.5em;
    border-radius: 0.25em;
    opacity: 0.2;
  }

  &.q-toggle--dense .q-toggle__thumb {
    /* top: 0.04em; */
    left: 0.04em;
    top: 50%;
    transform: translateY(-50%);
    width: 0.42em;
    height: 0.42em;
    border-radius: 50%;
  }
  &.q-toggle--dense .q-toggle__inner--truthy .q-toggle__thumb {
    left: 0.34em;
  }
}
</style>
