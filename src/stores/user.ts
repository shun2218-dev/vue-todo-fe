import { Token } from '../../types';
import { API_URL } from './../utils/API_URL';
import { defineStore } from 'pinia';

type State = {
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
};

type Getters = {};

type Actions = {
  getToken: () => Promise<void>;
  // getUser: (token: Token) => Promise<void>;
  setToken: (token: Token) => void;
  signIn: (token: Token) => void;
  signOut: () => void;
};
export const useUserStore = defineStore<string, State, Getters, Actions>({
  id: 'user',
  state: () => ({
    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
  }),
  actions: {
    async getToken() {
      try {
        const res = await fetch(API_URL('auth'), {
          method: 'GET',
        });
        if (!res.ok) throw new Error('Failed to authenticate');
      } catch (e: any) {
        console.error(e);
      }
    },
    setToken(token) {
      this.accessToken = token.accessToken;
      this.refreshToken = token.refreshToken;
    },
    signIn(token) {
      this.setToken(token);
      this.isLoggedIn = true;
    },
    async signOut() {
      this.isLoggedIn = false;
      this.accessToken = null;
      this.refreshToken = null;
    },
  },
  persist: true,
});
