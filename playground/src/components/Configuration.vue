<script lang="ts" setup>
import { QScrollArea } from 'quasar';
import { computed } from '@vue/reactivity';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import Preset from './Preset/index.vue';
import ConfigRaw from './configs/config-raw.vue';
import ConfigEnum from './configs/config-enum.vue';
import ConfigTheme from './configs/config-theme.vue';
import ConfigPoint from './configs/config-point.vue';
import ConfigNumber from './configs/config-number.vue';
import ConfigBoolean from './configs/config-boolean.vue';
// import ConfigColors from './configs/config-colors.vue';
import TinyDropdownSelect from './base/TinyDropdownSelect.vue';
import Github from './Github.vue';

import { useConfig } from '../hooks/useConfig';

const { isMobile } = useConfig();

const scrollComponent = computed(() => (isMobile.value ? 'div' : QScrollArea));

const { state, locale, username, configTabs, localeOptions, loadingConfig } =
  useConfig();

const activeTab = ref('');
const scrollShell = ref<any>(null);
const scrollTarget = ref<HTMLElement | null>(null);
const scrollFadeTop = ref(0);
const scrollFadeBottom = ref(0);
const scrollFadeMax = 40;
let scrollResizeObserver: ResizeObserver | null = null;

const showPreset = computed(() => activeTab.value === 'general');
const scrollMaskStyle = computed(() => ({
  '--config-scroll-fade-top': `${scrollFadeTop.value}px`,
  '--config-scroll-fade-bottom': `${scrollFadeBottom.value}px`,
}));

watch(
  configTabs,
  (tabs) => {
    if (!tabs.length) {
      activeTab.value = '';
      return;
    }

    if (!tabs.some((tab) => tab.key === activeTab.value)) {
      activeTab.value = tabs[0].key;
    }
  },
  { immediate: true },
);

function resolveComponent(cfg: any) {
  if (cfg.key === 'theme') return ConfigTheme;
  const type = cfg.type;
  if (type === 'enum') return ConfigEnum;
  if (type === 'boolean') return ConfigBoolean;
  if (type === 'int' || type === 'float') return ConfigNumber;
  if (type === 'colors' || type === 'color') return ConfigRaw;
  if (type === 'point') return ConfigPoint;
  return ConfigNumber;
}

function getScrollRoot() {
  const target = scrollShell.value;
  if (!target) return null;

  const root =
    typeof target === 'object' && '$el' in target ? target.$el : target;

  return root instanceof HTMLElement ? root : null;
}

function updateScrollFade(target = scrollTarget.value) {
  if (!target) {
    scrollFadeTop.value = 0;
    scrollFadeBottom.value = 0;
    return;
  }

  const top = Math.max(0, target.scrollTop);
  const bottom = Math.max(
    0,
    target.scrollHeight - target.clientHeight - target.scrollTop,
  );

  scrollFadeTop.value = Math.min(scrollFadeMax, Math.round(top));
  scrollFadeBottom.value = Math.min(scrollFadeMax, Math.round(bottom));
}

function handleScroll() {
  updateScrollFade();
}

function cleanupScrollTracking() {
  if (scrollTarget.value) {
    scrollTarget.value.removeEventListener('scroll', handleScroll);
  }
  if (scrollResizeObserver) {
    scrollResizeObserver.disconnect();
    scrollResizeObserver = null;
  }
}

function bindScrollTracking() {
  cleanupScrollTracking();

  nextTick(() => {
    const root = getScrollRoot();
    if (!root) {
      updateScrollFade(null);
      return;
    }

    const target =
      root.querySelector<HTMLElement>('.q-scrollarea__container') || root;
    const content =
      root.querySelector<HTMLElement>('.q-scrollarea__content') || null;

    scrollTarget.value = target;
    target.addEventListener('scroll', handleScroll, { passive: true });

    if (typeof ResizeObserver !== 'undefined') {
      scrollResizeObserver = new ResizeObserver(() => updateScrollFade(target));
      scrollResizeObserver.observe(target);
      if (content) scrollResizeObserver.observe(content);
    }

    updateScrollFade(target);
  });
}

watch(activeTab, () => bindScrollTracking());
watch(isMobile, () => bindScrollTracking());

onMounted(() => bindScrollTracking());
onBeforeUnmount(() => cleanupScrollTracking());
</script>

<template>
  <div class="column justify-start configuration-root">
    <header class="q-pa-md">
      <div class="row no-wrap items-center justify-between">
        <h3>{{ locale === 'zh' ? '配置' : 'Config' }}</h3>
        <div class="header-actions row no-wrap items-center">
          <TinyDropdownSelect :options="localeOptions" v-model="locale" />
          <Github size="0.95rem" />
        </div>
      </div>

      <q-input
        class="q-mt-md"
        dense
        filled
        label="Github Username"
        v-model="username"
      />

      <div v-if="configTabs.length" class="config-tabs-wrapper q-mt-md">
        <q-tabs
          v-model="activeTab"
          dense
          no-caps
          align="left"
          outside-arrows
          mobile-arrows
          indicator-color="transparent"
          class="config-tabs-bar"
        >
          <q-tab
            v-for="tab in configTabs"
            :key="tab.key"
            :name="tab.key"
            :label="tab.label"
            class="config-tab"
          />
        </q-tabs>
      </div>
    </header>
    <component
      :is="scrollComponent"
      ref="scrollShell"
      class="col-grow fit-grow q-mb-md config-scroll-shell"
      :style="scrollMaskStyle"
    >
      <div class="q-px-md q-pt-xs q-pb-md config-panels">
        <q-tab-panels
          v-if="configTabs.length"
          v-model="activeTab"
          animated
          class="config-tab-panels bg-transparent"
        >
          <q-tab-panel
            v-for="tab in configTabs"
            :key="tab.key"
            :name="tab.key"
            class="q-pa-none config-tab-panel"
          >
            <div class="config-group-list">
              <section
                v-if="showPreset && tab.key === 'general'"
                class="config-group config-group-preset"
              >
                <Preset />
              </section>

              <section
                class="config-group"
                v-for="group in tab.groups"
                :key="group.key"
              >
                <div class="config-group-header">
                  <div class="config-group-title">{{ group.label }}</div>
                  <div v-if="group.description" class="config-group-desc">
                    {{ group.description }}
                  </div>
                </div>

                <div class="config-group-body">
                  <div
                    :class="{ [`config-item-${cfg.type}`]: true }"
                    class="config-item"
                    v-for="cfg in group.items"
                    :key="cfg.key"
                  >
                    <div class="config-item-info">
                      <div class="config-item-title">{{ cfg.label }}</div>
                      <div class="config-item-desc">{{ cfg.description }}</div>
                    </div>

                    <component
                      class="config-item-control"
                      v-model="state[cfg.key]"
                      :options="cfg.optioins"
                      :is="resolveComponent(cfg)"
                      :type="cfg.type"
                      :min="cfg.min"
                      :max="cfg.max"
                    />
                  </div>
                </div>
              </section>
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <div v-else-if="!loadingConfig" class="config-empty">
          {{ locale === 'zh' ? '暂无可配置项' : 'No configurable options' }}
        </div>
      </div>
    </component>
  </div>
</template>

<style lang="scss">
.header-actions {
  gap: 4px;
  align-items: center;
}

.configuration-root {
  --config-surface-radius: 20px;
  backdrop-filter: blur(20px);
}

.config-scroll-shell {
  --config-scroll-fade-top: 0px;
  --config-scroll-fade-bottom: 0px;
  position: relative;
  overflow: hidden;
  border-radius: var(--config-surface-radius);
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 var(--config-scroll-fade-top),
    #000 calc(100% - var(--config-scroll-fade-bottom)),
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0,
    #000 var(--config-scroll-fade-top),
    #000 calc(100% - var(--config-scroll-fade-bottom)),
    transparent 100%
  );
}

.config-scroll-shell.q-scrollarea,
.config-scroll-shell .q-scrollarea__container,
.config-scroll-shell .q-scrollarea__content {
  border-radius: var(--config-surface-radius);
}

.config-tabs-wrapper {
  overflow: hidden;
}

.config-tabs-bar {
  --config-tab-shell-radius: 18px;
  --config-tab-shell-padding: 4px;
  min-height: 48px;
  padding: var(--config-tab-shell-padding);
  border-radius: var(--config-tab-shell-radius);
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(18px) saturate(160%);
}

.config-tabs-bar .q-tabs__content {
  border-radius: 0 !important;
}

.config-tab {
  min-height: 40px;
  padding: 0 14px;
  border-radius: calc(
    var(--config-tab-shell-radius) - var(--config-tab-shell-padding)
  );
  color: rgba(15, 23, 42, 0.72);
  transition: background-color 0.23s ease, color 0.23s ease;

  &.q-tab--active {
    color: #fff;
    background: var(--q-primary);
  }
}

.config-tab-panels,
.config-tab-panel {
  background: transparent;
}

.config-group-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-group {
  padding: 18px 16px;
  border-radius: var(--config-surface-radius);
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(20px) saturate(105%);
}

.config-group-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.config-group-title {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.8;
}

.config-group-desc {
  font-size: 0.72rem;
  opacity: 0.55;
}

.config-group-body {
  margin-top: 14px;
}

.config-empty {
  padding: 18px 16px;
  border-radius: var(--config-surface-radius);
  border: 1px dashed rgba(255, 255, 255, 0.26);
  background: rgba(255, 255, 255, 0.12);
  font-size: 0.82rem;
  opacity: 0.75;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &:not(:last-child) {
    margin-bottom: 18px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  }

  &-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &-title {
    font-weight: bold;
    font-size: 0.9rem;
  }
  &-desc {
    font-size: 0.7rem;
    line-height: 1.45;
    opacity: 0.48;
  }
}
.config-item.config-item-boolean {
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: nowrap;

  .config-item-info {
    width: 0;
    flex-grow: 1;
  }
  .config-item-control {
    flex-shrink: 0;
  }
  .config-item-desc {
    white-space: normal;
  }
}

.dark #configuration {
  .config-tabs-bar {
    border-color: rgba(255, 255, 255, 0.12);
    background: rgba(8, 15, 23, 0.34);
  }

  .config-tab {
    color: rgba(226, 232, 240, 0.76);
  }

  .config-group {
    border-color: rgba(255, 255, 255, 0.08);
    background: rgba(8, 15, 23, 0.34);
    backdrop-filter: blur(20px) saturate(140%);
  }

  .config-item:not(:last-child) {
    border-bottom-color: rgba(148, 163, 184, 0.12);
  }

  .config-empty {
    border-color: rgba(255, 255, 255, 0.12);
    background: rgba(8, 15, 23, 0.28);
  }
}
</style>
