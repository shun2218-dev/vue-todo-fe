<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { API_URL } from '../utils/API_URL';
import { computed, ref, watch } from 'vue';
import { Task } from '../../types/db';
import TaskItem from './TaskItem.vue';
import QueryMenu from './QueryMenu.vue';
import { useRoute, useRouter } from 'vue-router';
// import Pager from './Pager.vue';
import { ApiResponse, QueryParam } from '../../types';
import TaskDetail from './TaskDetail.vue';
import { useUserStore } from '../stores/user';
import { UPDATE_TOKEN } from '../utils/UPDATE_TOKEN';
import { SIGN_OUT } from '../utils/SIGN_OUT';
import { useModalStore } from '../stores/modal';

const queryClient = useQueryClient();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const modalStore = useModalStore();
const isTaskLoading = ref<boolean>(false);
const pageParam = ref<number>(parseInt((route.query.page as string) ?? '1'));

const getCacheKey = (page = route.query.page as string) => {
  const query: QueryParam = route.query;
  const keys: any[] = [];
  const queryKeys = ['orderBy', 'page', 'q', 'sorted'];
  queryKeys.forEach((key) => {
    switch (key) {
      case 'orderBy':
        keys.push({ order_by: query.orderBy ?? 'asc' });
        break;
      case 'page':
        const pageQuery = page ?? query.page;
        keys.push({ page: pageQuery ?? '1' });
        break;
      case 'q':
        query.q && keys.push({ q: query.q });
        break;
      case 'sorted':
        keys.push({ sorted: query.sorted ?? 'date' });
        break;
      default:
        break;
    }
  });
  return keys;
};

const currentPage = computed<number>({
  get: () => {
    return pageParam.value;
  },
  set: (val) => {
    pageParam.value = val;
  },
});
const totalPageNum = ref<number>(
  (queryClient.getQueryData(['total_page', ...getCacheKey()]) as number) ?? 1
);
const totalPage = computed<number>({
  get: () => totalPageNum.value,
  set: (val) => {
    totalPageNum.value = val;
  },
});

const cacheKey = computed(() => getCacheKey());
const taskData = ref<Task[] | null>(queryClient.getQueryData(['tasks', ...cacheKey.value]) ?? null);
const getTasks = async (page = 1) => {
  try {
    const res = await fetch(API_URL('task', { ...route.query, page } ?? {}), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userStore.accessToken}`,
      },
    });

    if (res.status === 403) {
      await UPDATE_TOKEN();
      await getTasks(page);
    }

    if (res.status === 401) await SIGN_OUT();

    if (!res.ok) throw new Error('Failed to get tasks');

    const result = await res.json();
    if (result.data.length < 1) throw new Error('No tasks have been registered yet!');

    taskData.value = result.data as Task[];
    return result;
  } catch (e: any) {
    console.error(e);
  }
};

const { isPending, isError, error, mutateAsync } = useMutation<ApiResponse<Task>>({
  mutationKey: ['tasks', ...cacheKey.value],
  mutationFn: () => getTasks(currentPage.value),
  onSuccess: (data) => {
    queryClient.setQueryData(['tasks', ...cacheKey.value], data?.data);
    queryClient.setQueryData(['total_page', ...cacheKey.value], data?.total_page);
    if (data?.total_page) totalPage.value = data?.total_page;
    if (queryClient.getQueryData(['total_page', ...cacheKey.value]))
      totalPage.value = queryClient.getQueryData(['total_page', ...cacheKey.value]) ?? 1;
  },
  onError: (error) => {
    console.error(error.message);
  },
});

const getLatestData = async () => {
  await mutateAsync();
};

if (!queryClient.getQueryData(['tasks', ...cacheKey.value])) {
  await getLatestData();
}

watch(
  pageParam,
  async (next) => {
    if (queryClient.getQueryData(['tasks', ...getCacheKey(next.toString())])) {
      taskData.value = queryClient.getQueryData(['tasks', ...getCacheKey(next.toString())]) ?? null;
    } else {
      await mutateAsync();
    }
  },
  { immediate: false }
);
const refetch = async () => {
  if (queryClient.getQueryData(['tasks', ...cacheKey.value])) {
    taskData.value = queryClient.getQueryData(['tasks', ...cacheKey.value]) ?? null;
    totalPage.value = queryClient.getQueryData(['total_page', ...cacheKey.value]) ?? 1;
  } else {
    await mutateAsync();
  }
};
watch(isPending, (next, prev) => {
  if (isTaskLoading && next && !prev) {
    isTaskLoading.value = true;
    setTimeout(() => {
      isTaskLoading.value = false;
    }, 500);
  }
});

const onPageClick = async (page: number) => {
  await router.push({
    path: '/list',
    query: {
      ...route.query,
      page,
    },
  });
};
console.log();
</script>

<template>
  <main class="main-content" :data-is-modal-open="modalStore.isDetailOpen">
    <h1>Task List</h1>
    <ul
      :class="{
        'task-list__failed': isError,
        'task-list__success': taskData !== null || (!isPending && !isError),
        'task-list__loading': isPending,
        'task-list': true,
      }"
    >
      <li class="task-list__query-menu">
        <query-menu :get-latest-data="getLatestData" :refetch="refetch" />
      </li>
      <task-item :is-pending="isTaskLoading" :is-error="isError" :tasks="taskData" :error="error" />
    </ul>

    <div class="pagination-wrapper">
      <BPagination
        v-if="!isPending && taskData"
        v-model="currentPage"
        :per-page="10"
        :total-rows="totalPage * 10"
        @page-click="(_, page) => onPageClick(page)"
      />
      <BSpinner small v-else-if="isPending" />
    </div>

    <router-link to="/create">Add New Task</router-link>
    <Teleport to="body">
      <Transition name="task_detail" mode="out-in" id="taskDetail">
        <task-detail
          v-if="modalStore.isDetailOpen && modalStore.modalTask"
          :get-latest-data="getLatestData"
        />
      </Transition>
    </Teleport>
  </main>
</template>

<style scoped lang="scss">
.task-list {
  list-style-type: none;
  border: 1px solid #323232;
  padding: 2rem 1rem;
  max-width: 80%;
  width: 400px;
  max-width: 90%;
  margin: 0 auto 2rem;
  @media screen and (min-width: 768px) {
    width: 500px;
    max-width: 90%;
  }
}
.pagination-wrapper {
  max-width: 90%;
  margin: 0 auto 2rem;
  @media screen and (min-width: 768px) {
    width: 500px;
  }
}

.task_detail-enter-active,
.task_detail-leave-active {
  transition: opacity 0.5s 0.2s ease;
}

.task_detail-enter-from,
.task_detail-leave-to {
  opacity: 0;
}
.modal-open {
  overflow: hidden;
}
</style>
