<script setup lang="ts">
import AddTask from '../components/AddTask.vue';
</script>

<template>
  <Suspense>
    <AddTask />
    <template #fallback>
      <BSpinner />
    </template>
  </Suspense>
</template>

<style scoped lang="scss"></style>
