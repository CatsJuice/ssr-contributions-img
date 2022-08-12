<script lang="ts" setup>
import { useConfig } from '../../hooks/useConfig';
import { computed } from '@vue/reactivity';

const props = defineProps({
  options: { type: Array, default: () => [] },
  modelValue: { type: String },
  required: { type: Boolean, default: false },
  selectOptions: { type: Object, default: () => ({}) },
});
defineEmits(['update:model-value']);

const { locale, darkMode } = useConfig();

const defaultOption = computed(() => ({
  label: { zh: '默认' }[locale.value] || 'Default',
  value: '',
}));

const finalOptions = computed(() =>
  props.required ? props.options : [defaultOption.value, ...props.options],
);

const popupContentClass = computed(() => {
  const names = ['q-pa-xs'];
  if (darkMode.value) names.push('bg-black');
  return names.join(' ');
});
</script>

<template name="config-enum">
  <q-select
    dense
    
    options-dense
    emit-value
    map-options
    :options="finalOptions"
    :model-value="modelValue"
    @update:model-value="(v) => $emit('update:model-value', v)"
    :menu-offset="[0, 5]"
    :popup-content-class="popupContentClass"
    filled
    v-bind="selectOptions"
  >
  </q-select>
</template>
