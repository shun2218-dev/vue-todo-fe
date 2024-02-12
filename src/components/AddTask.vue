<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';
import type { Task } from '../../types/db';
import { API_URL } from '../utils/API_URL';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { UPDATE_TOKEN } from '../utils/UPDATE_TOKEN';
import { SIGN_OUT } from '../utils/SIGN_OUT';

const router = useRouter();
const queryClient = useQueryClient();
const userStore = useUserStore();
const taskTitle = ref('');
const taskDescription = ref('');

const formReset = async () => {
  taskTitle.value = '';
  taskDescription.value = '';
  queryClient.clear();
  await router.push({
    path: '/list',
    state: {
      message: 'Task created successfully!!',
      type: 'create',
    },
  });
};
const createTask = async (newTask: Pick<Task, 'title' | 'description'>) => {
  try {
    const res = await fetch(API_URL('task'), {
      method: 'POST',
      body: JSON.stringify(newTask),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.accessToken}`,
      },
    });
    if (res.status === 201) return (await res.json()) as Task;

    if (res.status === 403) {
      await UPDATE_TOKEN();
      await createTask(newTask);
    }

    if (res.status === 401) {
      await SIGN_OUT();
    }
    throw new Error('Failed to create task');
  } catch (e) {
    console.error(e);
  }
};
const { mutateAsync } = useMutation({
  mutationFn: createTask,
  onSuccess: async (data) => {
    if (data) await formReset();
  },
  onError: async (error) => {
    console.error(error.message);
  },
});
const submitHandler = async () => {
  const data = {
    title: taskTitle.value,
    description: '',
  };
  if (taskDescription.value) data.description = taskDescription.value;

  await mutateAsync(data);
};
</script>

<template>
  <main class="main-content">
    <h1 class="create-task__title">Create Task</h1>
    <div class="form-container">
      <form @submit.prevent="submitHandler" class="task-form">
        <div class="task-form__input-wrapper">
          <label for="taskTitle" class="task-form__label" data-is-required="true"> Title </label>
          <input
            class="task-form__input"
            type="text"
            id="taskTitle"
            v-model="taskTitle"
            required
            aria-required="true"
          />
        </div>
        <div class="task-form__input-wrapper">
          <label for="taskDescription" class="task-form__label"> Description </label>
          <textarea
            class="task-form__input"
            name="task_description"
            id="taskDescription"
            cols="30"
            rows="10"
            v-model="taskDescription"
          ></textarea>
        </div>
        <button
          type="submit"
          :disabled="!taskTitle"
          :aria-disabled="!taskTitle"
          class="task-form__submit"
        >
          submit
        </button>
      </form>
    </div>
  </main>
</template>

<style scoped lang="scss">
.form-container {
  border: 1px solid #323232;
  padding: 10%;
  width: 400px;
  max-width: 100%;
  margin: 0 auto;
  margin-bottom: 3rem;
  .task-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    &__input-wrapper {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }
    &__input {
      width: 100%;
    }
    &__label {
      margin-bottom: 0.5rem;
      align-self: flex-start;
      text-transform: capitalize;
    }
    &__submit {
      align-self: center;
      margin-top: 2rem;
    }
    label[data-is-required='true']::after {
      content: '*';
      color: red;
      margin-left: 0.3rem;
    }
  }
  @media screen and (min-width: 768px) {
    padding: 5%;
  }
}
</style>
