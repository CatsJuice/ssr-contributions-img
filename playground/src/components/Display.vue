<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useWindowSize } from '@vueuse/core';

import Logo from './Logo.vue';

import { useConfig } from '../hooks/useConfig';
import { validatePath } from './utils/validatePath';
import { copyTextToClipboard } from './utils/copy2clipboard';
import { getApiPath } from '../utils/runtime-env';

const {
  svgCode,
  locale,
  username,
  queryStr,
  loadingConfig,
  loadingSvg,
  isMobile,
} = useConfig();
const { height } = useWindowSize();
const $q = useQuasar();
const scrollY = ref(0);

function download() {
  const a = document.createElement('a');
  a.href =
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgCode.value);
  a.download = `${username.value}.svg`;
  a.click();
}

function copy() {
  const orign = window.location.origin;
  const path = validatePath(
    `${getApiPath(`/_/${username.value}`)}?${queryStr.value}`,
  );
  const url = `${orign}${path}`;
  copyTextToClipboard(url);
  $q.notify({
    message: locale.value === 'zh' ? '已复制到剪切板' : 'Copied to clipboard',
    color: 'positive',
    position: 'top',
  });
}

onMounted(() => {
  document.body.addEventListener('scroll', (e: Event) => {
    if (!isMobile) return;
    const distance = document.body.scrollTop;
    // console.log(distance);
    const halfWindowHeight = height.value / 2;
    if (distance > halfWindowHeight) return;
    scrollY.value = (distance / halfWindowHeight) * 100;
  });
});
</script>

<template>
  <div
    class="display column flex-center"
    :style="{
      transform: `translateY(${-scrollY / 2}%)`,
    }"
  >
    <div class="row flex-center" v-html="svgCode" :style="{
      transform: `scale(${Math.max(1, 1 - scrollY / 200)})`,
    }"></div>
    <div
      class="loading-mask column flex-center"
      v-if="loadingConfig || loadingSvg"
    >
      <q-spinner />
    </div>
    <div class="exportor row no-wrap flex-center full-width">
      <q-btn
        :loading="loadingConfig || loadingSvg"
        outline
        color="white"
        text-color="white"
        class="exportor-download-btn"
        @click="download"
      >
        <q-icon name="fas fa-download" size="14px" class="q-mr-sm" />
        <span>{{ locale === 'zh' ? '下载' : 'Download' }}</span>
        <span class="text-caption" style="opacity: 0.8">（SVG）</span>
      </q-btn>

      <q-btn
        :loading="loadingConfig || loadingSvg"
        flat
        class="bg-white text-primary q-ml-sm exportor-copy-btn"
        @click="copy"
      >
        <q-icon name="fas fa-copy" size="14px" class="q-mr-sm" />
        <span>{{ locale === 'zh' ? '复制链接' : 'Copy link' }}</span>
      </q-btn>
    </div>

    <Logo id="logo" />
  </div>
</template>

<style lang="scss">
.display {
  --gap: 30px;
  position: relative;

  & svg {
    max-width: 95%;
    max-height: calc(100% - 2 * var(--gap));
  }

  .exportor {
    position: absolute;
    bottom: var(--gap);
    left: 50%;
    transform: translateX(-50%);
    max-width: 100%;
  }

  .loading-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px) saturate(180%);
  }

  #logo {
    position: absolute;
    top: var(--gap);
  }
  #logo {
    left: var(--gap);
  }

  .exportor-download-btn {
    border-color: rgba(255, 255, 255, 0.82);
    color: #fff;
    background: transparent !important;
  }

  .exportor-copy-btn {
    color: var(--q-primary);
    box-shadow: 0 14px 30px rgba(255, 255, 255, 0.18);
  }
}

.mobile .display {
  --gap: 20px;
  #logo {
    transform: scale(0.7);
    transform-origin: left top;
  }
}

.dark .display .loading-mask {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
