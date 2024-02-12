import { SIGN_OUT } from './SIGN_OUT';
import { Token } from '../../types';
import { useUserStore } from './../stores/user';
import { API_URL } from './API_URL';

export const UPDATE_TOKEN = async () => {
  try {
    const userStore = useUserStore();
    const res = await fetch(API_URL('auth/refresh'), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userStore.refreshToken}`,
      },
    });
    if (res.status === 403) {
      await SIGN_OUT();
    }
    const data = (await res.json()) as Token;
    userStore.setToken({ ...data });
  } catch (e) {
    console.error(e);
  }
};
