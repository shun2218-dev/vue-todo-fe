<script setup lang="ts">
import { computed, ref } from 'vue';
import { SortOption, OrderBy, QueryMenu, QueryParam } from '../../types';
import { useRoute, useRouter } from 'vue-router';

type Props = {
  getLatestData: () => Promise<void>;
  refetch: () => Promise<void>;
};

const { refetch } = defineProps<Props>();
const router = useRouter();
const route = useRoute();
const queryParams = computed<QueryParam>(() => route.query);
const isActive = ref<QueryMenu>('sort');
const sortOption = ref<SortOption>(queryParams.value.sorted ?? 'date');
const orderBy = ref<OrderBy>(queryParams.value.orderBy ?? 'asc');
const searchWord = ref<string>('');
const toggleMenu = (item: QueryMenu) => {
  isActive.value = item;
};

const getSortedData = async (sortOption: SortOption, orderBy: OrderBy) => {
  await router.push({
    path: '/list',
    query: { ...route.query, sorted: sortOption, orderBy },
  });
  await refetch();
};

const searchTasks = async (word: string) => {
  const query = { ...route.query };
  if (word) {
    await router.push({
      path: '/list',
      query: { ...query, q: word, page: '1' },
    });
  } else {
    searchWord.value = '';
    await router.push('/list');
  }
  await refetch();
};
</script>

<template>
  <ul class="query-menu">
    <li
      :class="{ 'query-menu__item': true, 'is-active': isActive === 'sort' }"
      @click="toggleMenu('sort')"
    >
      sort
    </li>
    <li
      :class="{ 'query-menu__item': true, 'is-active': isActive === 'search' }"
      @click="toggleMenu('search')"
    >
      search
    </li>
    <li
      :class="{ 'query-menu__item': true, 'is-active': isActive === 'update' }"
      @click="toggleMenu('update')"
    >
      update
    </li>
  </ul>
  <div class="query-content">
    <div v-if="isActive === 'sort'" class="query-content__item query-content__sort">
      <select
        name="sort-option"
        id="sortOption"
        class="sort-section sort-option"
        v-model="sortOption"
      >
        <option value="date">Created At</option>
        <option value="title">Title</option>
      </select>
      <select name="order-by" id="orderBy" class="sort-section order-by" v-model="orderBy">
        <option value="asc">ASC&nbsp&uarr;</option>
        <option value="desc">DESC&nbsp&darr;</option>
      </select>
      <button @click="getSortedData(sortOption, orderBy)">sort</button>
    </div>
    <div class="query-content__item query-content__update">
      <button @click="getLatestData" v-if="isActive === 'update'">update</button>
    </div>
    <div v-if="isActive === 'search'" class="query-content__item query-content__search">
      <input type="search" v-model="searchWord" />
      <div class="search__button-container">
        <button @click="searchTasks(searchWord)" :disabled="!searchWord" class="search__button">
          search
        </button>
        <button @click="searchTasks('')" class="search__button">reset</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.query-menu {
  list-style: none;
  padding: 0px;
  display: flex;
  border: 1px solid #323232;
  border-radius: 6px;
  max-width: 90%;
  margin: 0 auto;
  &__item {
    border-right: 1px solid #323232;
    padding: 0.2rem;
    text-align: center;
    flex: 1;
    &:last-child {
      border-right: none;
    }
    &:not(.is-active) {
      background-color: #d1d1d1;
      &:hover {
        background-color: #b8b8b8;
      }
    }
  }
  @media screen and (min-width: 768px) {
    &__item {
      padding: 0.5rem;
    }
  }
}
.query-content {
  margin: 1rem 0;
  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
}
.sort-section {
  padding: 0.25rem 0.5rem;
  & option {
    vertical-align: middle;
  }
}
.search__button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  & .search__button {
    width: 100%;
  }
}
</style>
