import { queryClient } from '../main';
import { router } from '../router';
import { useUserStore } from './../stores/user';

export const SIGN_OUT = async () => {
  try {
    const userStore = useUserStore();
    userStore.signOut();
    queryClient.clear();
    await router.push('/login');
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
    else console.error(e);
  }
};
