<script setup lang="ts">
import Display from './components/Display.vue';
import Configuration from './components/Configuration.vue';
import { useConfig } from './hooks/useConfig';
import { watch } from 'vue';
import { useQuasar } from 'quasar';

const { darkMode } = useConfig();
const $q = useQuasar();

watch(
  darkMode,
  (darkMode) => {
    $q.dark.set(darkMode);
  },
  { immediate: true },
);
</script>

<template>
  <div class="fit row no-wrap items-center" :class="{ dark: darkMode }">
    <Display id="display" class="col-grow fit-grow full-height"></Display>
    <Configuration id="configuration" class="full-height"></Configuration>
  </div>
</template>

<style lang="scss">
#display {
}

#configuration {
  width: 320px;
  flex-shrink: 0;
  box-shadow: -5px 0px 20px rgba(0, 0, 0, 0.05);
  background-color: white;
}
.dark #configuration {
  background-color: var(--q-dark);
}
</style>
