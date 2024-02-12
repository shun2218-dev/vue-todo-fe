<script setup lang="ts">
import Login from '../components/Login.vue';
</script>
<template>
  <Suspense>
    <Login />
    <template #fallback>
      <BSpinner />
    </template>
  </Suspense>
</template>
<style scoped lang="scss"></style>
