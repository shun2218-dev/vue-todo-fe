<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import Header from './components/Header.vue';
import { onMounted } from 'vue';
import { useScrollStore } from './stores/scroll';

const scrollStore = useScrollStore();
onMounted(() => {
  window.addEventListener('scroll', scrollStore.getScroll);
});
</script>

<template>
  <Header />
  <router-view></router-view>
  <VueQueryDevtools />
</template>

<style scoped lang="sass"></style>
