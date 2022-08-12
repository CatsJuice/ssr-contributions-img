<script setup lang="ts">
import { watch } from 'vue';
import { useQuasar } from 'quasar';

import Display from './components/Display.vue';
import Configuration from './components/Configuration.vue';

import { useConfig } from './hooks/useConfig';

const { darkMode, isMobile } = useConfig();
const $q = useQuasar();

watch(darkMode, (darkMode) => $q.dark.set(darkMode), { immediate: true });
</script>

<template>
  <div
    class="wrapper fit items-center"
    :class="{ dark: darkMode, mobile: isMobile }"
  >
    <Display id="display"></Display>
    <Configuration id="configuration"></Configuration>
  </div>
</template>

<style lang="scss">
#configuration {
  width: 320px;
  flex-shrink: 0;
  box-shadow: -5px 0px 20px rgba(0, 0, 0, 0.05);
  background-color: white;
}
.dark #configuration {
  background-color: var(--q-dark);
}

.wrapper {
  display: flex;
  #display {
    flex-grow: 1;
    width: 0;
  }
  #display,
  #configuration {
    height: 100%;
  }
}

@media screen and(max-width: 768px) {
  #app {
    height: fit-content !important;
  }
  body {
    overflow-y: auto !important;
    top: 0 !important;
  }
  .wrapper.fit {
    flex-direction: column;
    height: fit-content !important;

    #display {
      width: 100%;
      height: 50vh;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 0;
    }

    #configuration {
      width: 100%;
      z-index: 1;
      margin-top: 50vh;
      height: fit-content;
      display: block;
      padding-bottom: 60px;

      & > .col-grow.fit-grow {
        height: fit-content;
      }

      /* & > footer {
        background: inherit;
        width: 100%;
        position: fixed;
        bottom: 0;
      } */
    }
  }
}

body.mobile {
  top: 0 !important;
}
</style>
