<script lang="ts" setup>
import { useConfig, ConfigItem } from '../../hooks/useConfig';
import { computed } from '@vue/reactivity';
import SelectColorPreview from '../base/SelectColorPreview.vue';

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
  props.required
    ? props.options
    : [
        defaultOption.value,
        ...props.options.map((opt: any) => {
          const colors = [...(readColors(opt) || [])];
          return { ...opt, _colors: colors.reverse().slice(0, 4).reverse() };
        }),
      ],
);

const checkedOption = computed(() => {
  return finalOptions.value.find(
    (opt: any) => opt.value === props.modelValue,
  ) as any;
});

const popupContentClass = computed(() => {
  const names = ['q-pa-xs'];
  if (darkMode.value) names.push('bg-black');
  return names.join(' ');
});

function readColors(cfg: any) {
  return (cfg?.info?.colors || {})[darkMode.value ? 'dark' : 'light'];
}
</script>

<template name="config-enum">
  <q-select
    dense
    filled
    options-dense
    emit-value
    map-options
    :options="finalOptions"
    :model-value="modelValue"
    @update:model-value="(v) => $emit('update:model-value', v)"
    :menu-offset="[0, 5]"
    :popup-content-class="popupContentClass"
    v-bind="selectOptions"
  >
    <template v-slot:default>
      <q-item
        v-if="checkedOption?._colors?.length"
        dense
        class="row no-wrap items-center justify-between"
      >
        <select-color-preview :colors="checkedOption._colors" />
      </q-item>
    </template>
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        class="transition-1 row no-wrap justify-between items-center"
        style="font-size: 0.8rem"
      >
        <span>{{ scope.opt.label }}</span>
        <select-color-preview
          v-if="scope.opt._colors?.length"
          :colors="scope.opt._colors"
        />
      </q-item>
    </template>
  </q-select>
</template>
