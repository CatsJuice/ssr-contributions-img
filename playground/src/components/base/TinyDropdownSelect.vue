<script lang="ts" setup>
import { PropType, useSlots } from 'vue';
import { computed } from '@vue/reactivity';
const slots = useSlots();

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
    <q-item dense clickable class="tiny-dropdown-select-trigger row no-wrap items-center">
      <span class="text-caption">{{ activeItem.label }}</span>
      <span v-if="slots.icon" class="icon q-ml-xs">
        <slot name="icon"></slot>
      </span>
    </q-item>

    <q-menu :offset="[0, 5]">
      <q-list class="q-pa-xs menu-glass-surface">
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

<style lang="scss">
.tiny-dropdown-select-trigger {
  min-height: 32px;
  padding: 0 10px;
  border-radius: 16px;
}

.tiny-dropdown-select-item.active {
  color: var(--q-primary);
  font-weight: bold;
}
</style>
