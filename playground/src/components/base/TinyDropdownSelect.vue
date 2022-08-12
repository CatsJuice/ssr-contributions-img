<script lang="ts" setup>
import { defineProps, defineEmits, PropType } from 'vue';
import { computed } from '@vue/reactivity';
import { useConfig } from '../../hooks/useConfig';

const { darkMode } = useConfig();

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});
defineEmits(['update:modelValue']);

const activeItem = computed(() => {
  return props.options.find((item: any) => item.value === props.modelValue);
});
</script>

<template>
  <div class="tiny-dropdown-select">
    <q-item dense clickable class="row no-wrap items-center">
      <span class="text-caption">{{ activeItem.label }}</span>
      <span class="icon q-ml-xs">
        <slot name="icon"></slot>
      </span>
    </q-item>

    <q-menu :offset="[0, 5]">
      <q-list class="q-pa-xs" :class="darkMode ? 'bg-black' : null">
        <q-item
          v-for="opt in options"
          :key="opt.value"
          dense
          clickable
          class="tiny-dropdown-select-item row no-wrap items-center text-caption transition-1"
          :class="{ active: opt.value === modelValue }"
          @click="$emit('update:modelValue', opt.value)"
          v-close-popup
        >
          {{ opt.label }}
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>
