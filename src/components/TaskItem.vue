<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue';
import { Task } from '../../types/db';
import { useModalStore } from '../stores/modal';

type Props = {
  isPending: boolean;
  isError: boolean;
  tasks: Task[] | null;
  error: Error | null;
};
const { isPending } = defineProps<Props>();
const modalStore = useModalStore();
const taskListHeight = ref<number | null>(null);
onMounted(() => {
  taskListHeight.value = document.getElementById('taskList')?.clientHeight ?? null;
});
onUpdated(() => {
  taskListHeight.value = document.getElementById('taskList')?.clientHeight ?? null;
});
</script>

<template>
  <ul
    :class="{
      'task-list__item': true,
      scroll: taskListHeight && taskListHeight >= 400,
    }"
    id="taskList"
  >
    <li v-if="isPending" class="task-item task-item__loading">
      <BSpinner />
    </li>
    <li v-else-if="tasks === null || tasks.length === 0" class="task-item task-item__not-found">
      <p><strong>No tasks have been registered yet!</strong></p>
      <router-link to="/create">Add New Task</router-link>
    </li>
    <li v-else-if="isError" class="task-item task-item__error">Error: {{ error?.message }}</li>
    <li
      v-else
      class="task-item task-item__success"
      v-for="item in tasks"
      :key="item.id"
      :id="item.id"
      @click="modalStore.openDetailModal(item)"
    >
      {{ item.title }}
    </li>
  </ul>
</template>

<style scoped lang="scss">
.task-list__item {
  list-style-type: none;
  padding: 0.5rem 1rem;
  margin: 0 1rem;
  height: 100%;
  max-height: 400px;
  &.scroll {
    overflow-y: scroll;
  }
}
.task-item {
  border: 1px solid #323232;
  border-radius: 6px;
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #dddddd;
    transition: background-color 0.5s ease;
  }
  &:last-child {
    margin-bottom: 0;
  }
  &__loading {
    border: none;
  }
}
</style>
