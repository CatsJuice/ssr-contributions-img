<script lang="ts" setup>
import { getGithubRepoUrl } from '../utils/runtime-env';

const href = getGithubRepoUrl();
</script>

<template>
  <a :href="href" target="_blank">
    <q-icon name="fab fa-github" size="2rem" />
  </a>
</template>

<style scoped>
a {
  color: unset;
  text-decoration: none;
}
</style>
