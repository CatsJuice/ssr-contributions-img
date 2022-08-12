<script lang="ts" setup>
import ConfigEnum from './configs/config-enum.vue';
import ConfigBoolean from './configs/config-boolean.vue';
import ConfigNumber from './configs/config-number.vue';
import ConfigColors from './configs/config-colors.vue';
import ConfigPoint from './configs/config-point.vue';
import ConfigRaw from './configs/config-raw.vue';

import { useConfig } from '../hooks/useConfig';
import TinyDropdownSelect from './base/TinyDropdownSelect.vue';

const {
  state,
  locale,
  username,
  configItems,
  localeOptions,
  confirmDisabled,
  loadingSvg,
  loadingConfig,
  confirm,
} = useConfig();
</script>

<template>
  <div class="column justify-start">
    <header class="q-pa-md">
      <div class="row no-wrap items-center justify-between">
        <h3>{{ locale === 'zh' ? '配置' : 'Config' }}</h3>
        <TinyDropdownSelect :options="localeOptions" v-model="locale">
          <template v-slot:icon>
            <q-icon name="fas fa-earth-africa"></q-icon>
          </template>
        </TinyDropdownSelect>
      </div>

      <q-input class="q-mt-md" dense filled label="Github Username" v-model="username" />
    </header>
    <q-scroll-area class="col-grow fit-grow q-my-md">
      <div class="q-pa-md">
        <div
          :class="{ [`config-item-${cfg.type}`]: true }"
          class="config-item"
          v-for="cfg in configItems"
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
            :is="
              cfg.type === 'enum'
                ? ConfigEnum
                : cfg.type === 'boolean'
                ? ConfigBoolean
                : cfg.type === 'int' || cfg.type === 'float'
                ? ConfigNumber
                : cfg.type === 'colors'
                ? ConfigRaw
                : cfg.type === 'point'
                ? ConfigPoint
                : ConfigNumber
            "
            :type="cfg.type"
            :min="cfg.min"
            :max="cfg.max"
          />
        </div>
      </div>
    </q-scroll-area>
    <footer class="q-pa-md">
      <q-btn
        :loading="loadingSvg || loadingConfig"
        @click="confirm"
        :disable="confirmDisabled"
        class="full-width bg-primary text-white"
        flat
      >
        <q-icon name="fas fa-check" size="15px" class="q-mr-sm" />
        <span>{{ locale === 'zh' ? '确认' : 'Confirm' }}</span>
      </q-btn>
    </footer>
  </div>
</template>

<style lang="scss">
.config-item {
  display: flex;
  flex-direction: column;

  &:not(:nth-last-child(1)) {
    margin-bottom: 27px;
  }

  &-info {
    display: flex;
    flex-direction: column;
  }

  &-title {
    font-weight: bold;
    font-size: 0.9rem;
  }
  &-desc {
    font-size: 0.7rem;
    opacity: 0.4;
    transform: scale(0.9);
    transform-origin: 0% 0%;
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
    white-space: nowrap;
  }
}
</style>
