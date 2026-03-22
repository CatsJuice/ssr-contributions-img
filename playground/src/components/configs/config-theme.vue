<script lang="ts" setup>
import { PropType, computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

import MagicHoverCard from '../base/MagicHoverCard.vue';
import ThemePaletteSwatches from './ThemePaletteSwatches.vue';

import { useConfig } from '../../hooks/useConfig';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  options: {
    type: Array as PropType<Array<Record<string, any>>>,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const {
  locale,
  state,
  isMobile,
  activeDarkMode,
  themePreviewKey,
  renderThemePreview,
} = useConfig();

const dialog = ref(false);
const search = ref('');
const previewMap = ref<Record<string, string>>({});
const loadingMap = ref<Record<string, boolean>>({});
const galleryListRef = ref<HTMLElement | null>(null);

let queueToken = 0;
let queueFrameId: number | null = null;
let queueIdleId: number | null = null;

const themeCellElements = new Map<string, HTMLElement>();

const allOptions = computed(() => props.options || []);
const hasCustomColors = computed(() => !!`${state.value.colors || ''}`.trim());
const currentOption = computed(
  () =>
    allOptions.value.find((item) => item.value === props.modelValue) ||
    allOptions.value[0],
);
const triggerSvg = computed(() => previewMap.value[props.modelValue] || '');

const filteredOptions = computed(() => {
  const keyword = search.value.trim().toLowerCase();
  if (!keyword) return allOptions.value;

  return allOptions.value.filter((item) => {
    const label = `${item.label || ''}`.toLowerCase();
    const value = `${item.value || ''}`.toLowerCase();
    return label.includes(keyword) || value.includes(keyword);
  });
});
const filteredValuesKey = computed(() =>
  filteredOptions.value.map((item) => item.value).join('|'),
);

function setLoading(value: string, loading: boolean) {
  if (loading) {
    loadingMap.value[value] = true;
    return;
  }

  delete loadingMap.value[value];
}

async function ensurePreview(value: string) {
  if (!value || value === 'random') return;
  if (previewMap.value[value] || loadingMap.value[value]) return;

  setLoading(value, true);
  try {
    const svg = await renderThemePreview(value);
    previewMap.value[value] = svg;
  } finally {
    setLoading(value, false);
  }
}

function setCellRef(value: string, el: unknown) {
  if (el instanceof HTMLElement) {
    themeCellElements.set(value, el);
    return;
  }

  themeCellElements.delete(value);
}

function clearScheduledQueueWork() {
  if (queueFrameId !== null) {
    window.cancelAnimationFrame(queueFrameId);
    queueFrameId = null;
  }

  if (queueIdleId !== null) {
    const currentWindow = window as Window & {
      cancelIdleCallback?: (handle: number) => void;
    };
    if (currentWindow.cancelIdleCallback) {
      currentWindow.cancelIdleCallback(queueIdleId);
    } else {
      window.clearTimeout(queueIdleId);
    }
    queueIdleId = null;
  }
}

function cancelPreviewQueue() {
  queueToken += 1;
  clearScheduledQueueWork();
}

function scheduleIdleTask(callback: (deadline: IdleDeadline | null) => void) {
  const currentWindow = window as Window & {
    requestIdleCallback?: (
      handler: IdleRequestCallback,
      options?: IdleRequestOptions,
    ) => number;
  };

  if (currentWindow.requestIdleCallback) {
    return currentWindow.requestIdleCallback(
      (deadline) => callback(deadline),
      { timeout: 120 },
    );
  }

  return window.setTimeout(() => callback(null), 16);
}

function getVisibleThemeValues(values: string[]) {
  const galleryList = galleryListRef.value;
  if (!galleryList) return values.slice(0, 6);

  const listRect = galleryList.getBoundingClientRect();
  const visibleValues = values.filter((value) => {
    const cell = themeCellElements.get(value);
    if (!cell) return false;

    const rect = cell.getBoundingClientRect();
    return (
      rect.bottom > listRect.top &&
      rect.top < listRect.bottom &&
      rect.right > listRect.left &&
      rect.left < listRect.right
    );
  });

  return visibleValues.length ? visibleValues : values.slice(0, 6);
}

function buildPreviewQueue() {
  const values = filteredOptions.value
    .map((item) => item.value)
    .filter((value) => value && value !== 'random');
  const activeValue = `${props.modelValue || ''}`;
  const visibleValues = getVisibleThemeValues(values);

  return [
    ...new Set([
      ...(values.includes(activeValue) ? [activeValue] : []),
      ...visibleValues,
      ...values,
    ]),
  ];
}

function runPreviewQueue(orderedValues: string[], token: number, index = 0) {
  if (token !== queueToken || !dialog.value) return;

  const value = orderedValues[index];
  if (!value) return;

  queueIdleId = scheduleIdleTask(async (deadline) => {
    queueIdleId = null;
    if (token !== queueToken || !dialog.value) return;

    if (deadline && !deadline.didTimeout && deadline.timeRemaining() < 8) {
      runPreviewQueue(orderedValues, token, index);
      return;
    }

    await ensurePreview(value);
    if (token !== queueToken || !dialog.value) return;

    runPreviewQueue(orderedValues, token, index + 1);
  });
}

function schedulePreviewQueueAfterPaint() {
  if (!dialog.value) return;

  const token = ++queueToken;
  clearScheduledQueueWork();

  nextTick(() => {
    if (token !== queueToken || !dialog.value) return;

    queueFrameId = window.requestAnimationFrame(() => {
      queueFrameId = null;
      if (token !== queueToken || !dialog.value) return;

      runPreviewQueue(buildPreviewQueue(), token);
    });
  });
}

function selectTheme(value: string) {
  emit('update:modelValue', value);
  dialog.value = false;
}

function getThemePalette(option: Record<string, any>) {
  const mode = activeDarkMode.value ? 'dark' : 'light';
  const palette = option?.info?.colors?.[mode];
  return Array.isArray(palette) ? palette.filter(Boolean) : [];
}

watch(
  () => [props.modelValue, themePreviewKey.value],
  () => {
    if (props.modelValue && props.modelValue !== 'random') {
      ensurePreview(props.modelValue);
    }
  },
  { immediate: true },
);

watch(themePreviewKey, () => {
  previewMap.value = {};
  loadingMap.value = {};
  if (props.modelValue && props.modelValue !== 'random') {
    ensurePreview(props.modelValue);
  }
  if (dialog.value) schedulePreviewQueueAfterPaint();
});

watch(
  () => [dialog.value, filteredValuesKey.value],
  () => {
    if (!dialog.value) {
      cancelPreviewQueue();
      return;
    }

    schedulePreviewQueueAfterPaint();
  },
  { flush: 'post' },
);

onBeforeUnmount(() => {
  cancelPreviewQueue();
});
</script>

<template>
  <div class="theme-picker">
    <q-btn
      flat
      no-caps
      class="theme-picker-trigger full-width"
      @click="dialog = true"
    >
      <div class="row no-wrap items-center full-width">
        <div class="theme-picker-trigger-preview">
          <div
            v-if="triggerSvg"
            class="theme-picker-svg"
            v-html="triggerSvg"
          ></div>
          <div v-else class="theme-picker-trigger-random">
            {{ modelValue === 'random' ? 'RANDOM' : '...' }}
          </div>
        </div>

        <div class="theme-picker-trigger-meta">
          <div class="theme-picker-trigger-label">
            {{ currentOption?.label || modelValue || 'Theme' }}
          </div>
          <div class="theme-picker-trigger-desc">
            {{ locale === 'zh' ? '主题画廊' : 'Theme gallery' }}
          </div>
        </div>

        <q-icon name="fas fa-chevron-right" size="12px" />
      </div>
    </q-btn>

    <q-dialog
      v-model="dialog"
      :maximized="isMobile"
      class="theme-gallery-dialog"
    >
      <q-card class="theme-gallery-shell">
        <div
          class="theme-gallery-header row no-wrap items-center justify-between"
        >
          <div>
            <div class="theme-gallery-title">
              {{ locale === 'zh' ? '主题预览' : 'Theme Gallery' }}
            </div>
            <div class="theme-gallery-subtitle">
              {{
                locale === 'zh'
                  ? '优先使用当前用户的真实贡献数据进行对比，空态时回退到 demo 数据'
                  : 'Compare themes with the current user data, with demo data as fallback'
              }}
            </div>
          </div>

          <q-btn flat round dense icon="fas fa-times" @click="dialog = false" />
        </div>

        <div class="theme-gallery-toolbar">
          <q-input
            v-model="search"
            dense
            filled
            :label="locale === 'zh' ? '搜索主题' : 'Search themes'"
          />

          <div v-if="hasCustomColors" class="theme-gallery-note">
            {{
              locale === 'zh'
                ? '当前填写了自定义颜色，实际主预览会优先使用 colors；这里仍展示原主题本身。'
                : 'Custom colors currently override the live preview. The gallery still shows each base theme.'
            }}
          </div>
        </div>

        <div ref="galleryListRef" class="theme-gallery-list">
          <div class="theme-gallery-grid">
            <div
              v-for="opt in filteredOptions"
              :key="opt.value"
              :ref="(el) => setCellRef(opt.value, el)"
              class="theme-gallery-cell"
              @click="selectTheme(opt.value)"
            >
              <MagicHoverCard class="theme-gallery-hover">
                <div
                  class="theme-card"
                  :class="{ active: opt.value === modelValue }"
                >
                  <div class="theme-card-preview">
                    <div
                      v-if="opt.value === 'random'"
                      class="theme-card-random column justify-between"
                    >
                      <span>RANDOM</span>
                      <small>
                        {{
                          locale === 'zh'
                            ? '每次渲染随机选主题'
                            : 'Pick a theme on each render'
                        }}
                      </small>
                    </div>
                    <div
                      v-else-if="previewMap[opt.value]"
                      class="theme-picker-svg"
                      v-html="previewMap[opt.value]"
                    ></div>
                    <q-skeleton
                      v-else
                      height="100%"
                      width="100%"
                      square
                      animation="fade"
                    />
                  </div>

                  <div class="theme-card-footer">
                    <div class="theme-card-copy">
                      <div class="theme-card-title">{{ opt.label }}</div>
                      <div class="theme-card-value">{{ opt.value }}</div>
                    </div>

                    <div
                      v-if="
                        opt.value !== 'random' && getThemePalette(opt).length
                      "
                      class="theme-card-swatches"
                    >
                      <ThemePaletteSwatches :colors="getThemePalette(opt)" />
                    </div>
                  </div>
                </div>
              </MagicHoverCard>
            </div>
          </div>

          <div v-if="!filteredOptions.length" class="theme-gallery-empty">
            {{
              locale === 'zh'
                ? '没有匹配的主题'
                : 'No themes matched the search'
            }}
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss">
.theme-gallery-dialog {
  .q-dialog__inner--minimized {
    padding: 16px;

    > div {
      width: min(1080px, 80vw) !important;
      max-width: calc(100vw - 32px) !important;
      max-height: 80vh !important;
    }
  }
}

.theme-picker-trigger {
  padding: 6px !important;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.theme-picker-trigger-preview {
  width: 92px;
  height: 56px;
  overflow: hidden;
  flex-shrink: 0;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.08);
}

.theme-picker-trigger-random {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.theme-picker-trigger-meta {
  width: 0;
  flex-grow: 1;
  text-align: left;
  padding: 0 12px;
}

.theme-picker-trigger-label {
  font-size: 0.86rem;
  font-weight: 700;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.theme-picker-trigger-desc {
  margin-top: 2px;
  font-size: 0.68rem;
  opacity: 0.55;
}

.theme-gallery-shell {
  --theme-gallery-column-min: 212px;
  width: 100%;
  max-width: none;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.56);
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.62),
      rgba(255, 255, 255, 0.34)
    ),
    rgba(244, 246, 251, 0.28);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.34);
  backdrop-filter: blur(28px) saturate(155%);
}

.theme-gallery-header {
  flex-shrink: 0;
  padding: 20px 24px 0;
}

.theme-gallery-title {
  font-size: 1.1rem;
  font-weight: 700;
}

.theme-gallery-subtitle {
  margin-top: 4px;
  font-size: 0.74rem;
  opacity: 0.58;
}

.theme-gallery-note {
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 0.74rem;
  line-height: 1.5;
  background: rgba(251, 191, 36, 0.14);
  color: #7c4a03;
}

.theme-gallery-toolbar {
  padding: 16px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.theme-gallery-list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 4px 24px 24px;
}

.theme-gallery-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, var(--theme-gallery-column-min)), 1fr)
  );
  gap: 12px;
}

.theme-gallery-cell {
  min-width: 0;
}

.theme-gallery-hover {
  width: 100%;
}

.theme-card {
  --theme-card-surface: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.08)
    ),
    rgba(255, 255, 255, 0.08);
  padding: 10px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.26);
  background: var(--theme-card-surface);
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(18px) saturate(145%);
  transition: border-color 0.23s ease, transform 0.23s ease;

  &.active {
    border-color: var(--q-primary) !important;
    box-shadow: 0 0 0 1px var(--q-primary) !important;
  }
}

.theme-card-preview {
  height: 126px;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.04);
}

.theme-picker-svg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  & > svg {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }
}

.theme-card-random {
  width: 100%;
  height: 100%;
  padding: 12px;
  background: radial-gradient(
      circle at top left,
      rgba(251, 191, 36, 0.35),
      transparent 45%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(244, 63, 94, 0.28),
      transparent 42%
    ),
    linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(30, 41, 59, 0.92));
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.12em;

  small {
    display: block;
    line-height: 1.45;
    letter-spacing: normal;
    font-size: 0.7rem;
    font-weight: 500;
    opacity: 0.82;
  }
}

.theme-card-footer {
  margin-top: 10px;
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.theme-card-copy {
  min-width: 0;
  flex: 1 1 auto;
}

.theme-card-title {
  font-size: 0.82rem;
  font-weight: 700;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.theme-card-value {
  margin-top: 2px;
  font-size: 0.68rem;
  opacity: 0.5;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.theme-card-swatches {
  flex-shrink: 0;
  padding-left: 8px;
}

.theme-gallery-empty {
  margin-top: 12px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(148, 163, 184, 0.12);
  font-size: 0.8rem;
  opacity: 0.7;
}

body.body--dark {
  .theme-picker-trigger {
    background: rgba(8, 15, 23, 0.4);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .theme-picker-trigger-preview,
  .theme-card-preview {
    background: rgba(255, 255, 255, 0.04);
  }

  .theme-gallery-shell {
    border-color: rgba(255, 255, 255, 0.14);
    background: linear-gradient(
        180deg,
        rgba(16, 24, 40, 0.74),
        rgba(8, 15, 23, 0.5)
      ),
      rgba(8, 15, 23, 0.42);
    box-shadow: 0 28px 68px rgba(0, 0, 0, 0.44),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .theme-gallery-note {
    background: rgba(245, 158, 11, 0.18);
    color: #fed7aa;
  }

  .theme-card {
    --theme-card-surface: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.08),
        rgba(255, 255, 255, 0.03)
      ),
      rgba(15, 23, 42, 0.34);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
}

@media screen and (max-width: 768px) {
  .theme-gallery-shell {
    --theme-gallery-column-min: 156px;
    width: 100%;
    height: 100vh;
    max-height: none;
    border-radius: 0;
  }

  .theme-gallery-header {
    padding: 16px 16px 0;
  }

  .theme-gallery-toolbar {
    padding: 12px 16px 0;
  }

  .theme-gallery-list {
    padding: 4px 16px 16px;
  }
}
</style>
