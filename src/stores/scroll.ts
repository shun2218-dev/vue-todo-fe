import { defineStore } from 'pinia';

type State = {
  x: number;
  y: number;
};

type Getters = {};

type Actions = {
  getScroll: () => void;
};

export const useScrollStore = defineStore<string, State, Getters, Actions>({
  id: 'scroll',
  state: () => ({
    x: 0,
    y: 0,
  }),
  actions: {
    getScroll() {
      this.x = window.scrollX;
      this.y = window.scrollY;
    },
  },
  persist: true,
});
