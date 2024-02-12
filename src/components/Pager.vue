<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { QueryParam } from '../../types';
import { computed } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';

type Props = {
  currentPage: number;
  refetch: () => Promise<void>;
  getCacheKey: () => any[];
};

const { getCacheKey } = defineProps<Props>();
const router = useRouter();
const route = useRoute();
const queryClient = useQueryClient();
const queryParam = computed<QueryParam>(() => route.query);
const totalPage = computed<number>(
  () =>
    (queryClient.getQueryData(['total_page', ...getCacheKey()]) as number) ?? 1
);

const onClick = async (page: number) => {
  await router.push({
    path: '/',
    query: {
      ...queryParam.value,
      page,
    },
  });
};
</script>

<template>
  <ul class="pager-container">
    <li
      :class="{
        'pager-item': true,
        'pager-item__active': page === currentPage,
      }"
      v-for="page in totalPage"
      :key="`pager_${page}`"
    >
      <span
        v-if="page !== currentPage"
        class="pager-item__num"
        @click="onClick(page)"
      >
        {{ page }}
      </span>
      <span class="pager-item__num" v-else>{{ page }}</span>
    </li>
  </ul>
  <!-- <pager
      :current-page="currentPage"
      :refetch="refetch"
      :get-cache-key="getCacheKey"
      v-if="!isTaskLoading && taskData !== null && taskData.length > 1"
    ></pager> -->
</template>

<style>
.pager-container {
  list-style-type: none;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 5%;
  & .pager-item {
    & .pager-item__num {
      border: 1px solid #323232;
      padding: 0.2rem 0.5rem;
      background-color: white;
      color: #323232;
      cursor: pointer;
    }
    &.pager-item__active {
      & .pager-item__num {
        background-color: #323232;
        color: white;
        cursor: auto;
      }
    }
  }
}
</style>
