<script setup lang="ts">
import TaskList from '../components/TaskList.vue';
</script>

<template>
  <Suspense>
    <TaskList />
    <template #fallback>
      <BSpinner />
    </template>
  </Suspense>
</template>

<style scoped lang="scss"></style>
