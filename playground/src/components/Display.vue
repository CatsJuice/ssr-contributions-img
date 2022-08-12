<script lang="ts" setup>
import { useConfig } from '../hooks/useConfig';
import { copyTextToClipboard } from './utils/copy2clipboard';
import { validatePath } from './utils/validatePath';
import { useQuasar } from 'quasar';
import Github from './Github.vue';
import Logo from './Logo.vue';
const { svgCode, locale, username, queryStr, loadingConfig, loadingSvg } =
  useConfig();
const $q = useQuasar();

function download() {
  const a = document.createElement('a');
  a.href =
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgCode.value);
  a.download = `${username.value}.svg`;
  a.click();
}

function copy() {
  const orign = window.location.origin;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const path = validatePath(`${baseUrl}/_/${username.value}?${queryStr.value}`);
  const url = `${orign}${path}`;
  copyTextToClipboard(url);
  $q.notify({
    message: locale.value === 'zh' ? '已复制到剪切板' : 'Copied to clipboard',
    color: 'positive',
    position: 'top',
  });
}
</script>

<template>
  <div class="display column flex-center">
    <div class="row flex-center" v-html="svgCode"></div>
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
        color="primary"
        @click="download"
      >
        <q-icon name="fas fa-download" size="14px" class="q-mr-sm" />
        <span>{{ locale === 'zh' ? '下载' : 'Download' }}</span>
        <span class="text-caption" style="opacity: 0.8">（SVG）</span>
      </q-btn>

      <q-btn
        :loading="loadingConfig || loadingSvg"
        flat
        class="bg-primary text-white q-ml-sm"
        @click="copy"
      >
        <q-icon name="fas fa-copy" size="14px" class="q-mr-sm" />
        <span>{{ locale === 'zh' ? '复制链接' : 'Copy link' }}</span>
      </q-btn>
    </div>

    <Github id="github" />
    <Logo id="logo" />
  </div>
</template>

<style lang="scss">
.display {
  --gap: 30px;
  position: relative;

  & svg {
    max-width: 95%;
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

  #github,
  #logo {
    position: absolute;
    top: var(--gap);
    /* right: var(--gap); */
  }
  #github {
    right: var(--gap);
  }
  #logo {
    left: var(--gap);
  }
}

.mobile .display {
  --gap: 20px;
  #logo {
    transform: scale(0.7);
    transform-origin: left center;
  }
}

.dark .display .loading-mask {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
