import { computed } from 'vue';
import { QueryParam } from '../../types';
import { useRoute } from 'vue-router';

const route = useRoute();
export const GET_TASK_QUERY_KEY = computed(() => {
  const query: QueryParam = route.query;
  const keys: string[] = ['tasks'];
  const queryKeys = ['orderBy', 'page', 'q', 'sorted'];
  queryKeys.forEach((key) => {
    switch (key) {
      case 'orderBy':
        keys.push(query.orderBy ?? 'asc');
        break;
      case 'page':
        keys.push(query.page ?? '1');
        break;
      case 'q':
        query.q && keys.push(query.q);
        break;
      case 'sorted':
        keys.push(query.sorted ?? 'date');
        break;
      default:
        break;
    }
  });
  return keys;
});
