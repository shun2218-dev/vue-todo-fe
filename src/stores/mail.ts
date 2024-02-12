import { defineStore } from 'pinia';

type State = {
  isEmailSent: boolean;
};

type Getters = {};

type Actions = {
  sendMail: () => void;
  resetState: () => void;
};

export const useMailStore = defineStore<string, State, Getters, Actions>({
  id: 'mail',
  state: () => ({
    isEmailSent: false,
  }),
  actions: {
    sendMail() {
      this.isEmailSent = true;
    },
    resetState() {
      this.isEmailSent = false;
    },
  },
  persist: true,
});
