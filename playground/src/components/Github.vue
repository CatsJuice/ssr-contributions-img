<script lang="ts" setup>
import { getGithubRepoUrl } from '../utils/runtime-env';

const props = withDefaults(
  defineProps<{
    size?: string;
  }>(),
  {
    size: '1.1rem',
  },
);

const href = getGithubRepoUrl();
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noreferrer"
    class="github-link"
    aria-label="GitHub"
  >
    <q-icon name="fab fa-github" :size="props.size" />
  </a>
</template>

<style scoped>
.github-link {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  text-decoration: none;
  line-height: 1;
  flex: 0 0 auto;
}
</style>
