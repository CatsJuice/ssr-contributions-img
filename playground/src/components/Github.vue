<script lang="ts" setup>
const href = import.meta.env.VITE_GITHUB_REPO_URL;
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
