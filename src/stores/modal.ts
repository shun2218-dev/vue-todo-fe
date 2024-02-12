import { defineStore } from 'pinia';
import { Task } from '../../types/db';

type State = {
  isDetailOpen: boolean;
  isConfirmOpen: boolean;
  modalTask: Task | null;
};

type Getters = {};

type Actions = {
  closeDetailModal: () => void;
  openDetailModal: (task: Task) => void;
  closeConfirmModal: () => void;
  openConfirmModal: () => void;
};

export const useModalStore = defineStore<string, State, Getters, Actions>({
  id: 'modal',
  state: () => ({
    isDetailOpen: false,
    isConfirmOpen: false,
    modalTask: null,
  }),
  actions: {
    closeDetailModal() {
      this.isDetailOpen = false;
      this.modalTask = null;
      this.closeConfirmModal();
    },
    openDetailModal(task) {
      this.isDetailOpen = true;
      this.modalTask = task;
    },
    closeConfirmModal() {
      this.isConfirmOpen = false;
    },
    openConfirmModal() {
      this.isConfirmOpen = true;
    },
  },
  persist: true,
});
