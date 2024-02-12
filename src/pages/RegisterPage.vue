<script setup lang="ts">
import Register from '../components/Register.vue';
</script>
<template>
  <Suspense>
    <Register />
    <template #fallback>
      <BSpinner />
    </template>
  </Suspense>
</template>
<style scoped lang="scss"></style>
