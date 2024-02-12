<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ApiResponse } from '../../types';
import { Task } from '../../types/db';
import { API_URL } from '../utils/API_URL';
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import { UPDATE_TOKEN } from '../utils/UPDATE_TOKEN';
import { SIGN_OUT } from '../utils/SIGN_OUT';
import { useScrollStore } from '../stores/scroll';
import { useModalStore } from '../stores/modal';

type Props = {
  getLatestData: () => Promise<void>;
};
const { getLatestData } = defineProps<Props>();
const userStore = useUserStore();
const scrollStore = useScrollStore();
const deleteTaskTitle = ref<string>('');
const istTitleEdit = ref<boolean>(true);
const istDescriptionEdit = ref<boolean>(true);
const editedTitle = ref<string | null>(null);
const editedDescription = ref<string | null>(null);

const queryClient = useQueryClient();
const modalStore = useModalStore();
const deleteTask = async (taskId: string) => {
  try {
    const res = await fetch(API_URL(`task/${taskId}`), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userStore.accessToken}`,
      },
    });
    if (res.status === 403) {
      await UPDATE_TOKEN();
      await deleteTask(taskId);
    }
    if (res.status === 401) await SIGN_OUT();
    if (!res.ok) throw new Error('Failed to delete task');
    const data = await res.json();
    return data;
  } catch (e: any) {
    console.error(e.message);
  }
};

const { mutateAsync: deleteMutateAsync } = useMutation<ApiResponse<Task>>({
  mutationKey: ['task_delete', modalStore.modalTask?.id!],
  mutationFn: () => deleteTask(modalStore.modalTask?.id!),
  onSuccess: async () => {
    queryClient.clear();
    await getLatestData();
    modalStore.closeDetailModal();
  },
  onError: (error) => {
    console.error(error.message);
  },
});

const toggleTtitleEdit = () => {
  if (istTitleEdit.value) editedTitle.value = modalStore.modalTask?.title!;
  istTitleEdit.value = !istTitleEdit.value;
};

const toggleDescriptionEdit = () => {
  if (istDescriptionEdit.value) editedDescription.value = modalStore.modalTask?.description!;
  istDescriptionEdit.value = !istDescriptionEdit.value;
};

const updateTask = async (taskId: string) => {
  try {
    const formBody = {
      title: editedTitle.value ?? modalStore.modalTask?.title!,
      description: editedDescription.value ?? modalStore.modalTask?.description!,
    };

    const res = await fetch(API_URL(`task/${taskId}`), {
      method: 'PUT',
      body: JSON.stringify(formBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.accessToken}`,
      },
    });

    if (res.status === 403) {
      await UPDATE_TOKEN();
      await updateTask(taskId);
    }

    if (!res.ok) throw new Error('Failed to update task');

    const data = await res.json();
    return data;
  } catch (e: any) {
    console.error(e.message);
  }
};
const { mutateAsync: updateMutateAsync, isPending: isPendingUpdate } = useMutation({
  mutationKey: ['task_update', modalStore.modalTask?.id!],
  mutationFn: () => updateTask(modalStore.modalTask?.id!),
  onSuccess: async () => {
    queryClient.clear();
    await getLatestData();
    modalStore.closeDetailModal();
  },
  onError: (error) => {
    console.error(error.message);
  },
});
</script>
<template>
  <div class="task-detail v-modal" :style="{ top: `${scrollStore.y}px` }">
    <div class="modal__overlay" @click="modalStore.closeDetailModal()"></div>
    <div class="modal__container">
      <button class="modal__close-button" @click="modalStore.closeDetailModal()">
        <span class="modal__close-icon">&times;</span>
      </button>
      <div class="modal__body" v-if="modalStore.modalTask">
        <dl>
          <dt>id</dt>
          <dd>{{ modalStore.modalTask?.id }}</dd>
          <dt>
            <span>title</span>
            <button class="task-editable__button" @click="toggleTtitleEdit">
              <i class="bi bi-pen-fill"></i>
            </button>
          </dt>
          <dd>
            <span class="task-editable__text" v-if="istTitleEdit">{{
              modalStore.modalTask?.title
            }}</span>
            <input
              type="text"
              name="task-title"
              required
              aria-required="true"
              v-else
              v-model="editedTitle"
              class="task-editable__input"
            />
          </dd>
          <dt>
            <span>description</span>
            <button class="task-editable__button" @click="toggleDescriptionEdit">
              <i class="bi bi-pen-fill"></i>
            </button>
          </dt>
          <dd>
            <span class="task-editable__text" v-if="istDescriptionEdit"
              >{{ modalStore.modalTask?.description }}
            </span>
            <input
              type="text"
              name="task-description"
              required
              aria-required="true"
              v-else
              v-model="editedDescription"
              class="task-editable__input"
            />
          </dd>
          <dt>created at</dt>
          <dd>
            {{ modalStore.modalTask?.createdAt.toLocaleString() }}
          </dd>
          <dt v-if="modalStore.modalTask?.updatedAt">updated at</dt>
          <dd>{{ modalStore.modalTask?.updatedAt.toLocaleString() }}</dd>
        </dl>
      </div>
      <div class="task-detail__button-container">
        <BButton
          class="task-detail__save-button"
          variant="primary"
          @click="async () => await updateMutateAsync()"
          aria-label="save task"
          :disabled="!editedTitle && !editedDescription"
        >
          <BSpinner small v-if="isPendingUpdate" />
          <span v-if="isPendingUpdate">Saving...</span>
          <span v-else>Save</span>
        </BButton>
        <BButton
          class="task-detail__delete-button"
          variant="outline-danger"
          @click="modalStore.openConfirmModal"
          aria-label="delete task"
        >
          Delete
        </BButton>
      </div>
    </div>
    <Transition name="confirm-deletion" mode="out-in">
      <div class="confirm-deletion v-modal" v-if="modalStore.isConfirmOpen">
        <div class="modal__overlay" @click="modalStore.closeConfirmModal"></div>
        <div class="modal__container">
          <button
            class="modal__close-button"
            @click="modalStore.closeConfirmModal"
            aria-label="Close modal to confirm deletion"
          >
            <span class="modal__close-icon">&times;</span>
          </button>
          <div class="modal__body">
            <h1 class="modal__title">
              Are you sure you want to delete "{{ modalStore.modalTask?.title }}"?<br />
              Please enter "{{ modalStore.modalTask?.title }}" for confirmation.
            </h1>
            <form action="" class="delete-form">
              <input
                type="text"
                name="delete-task"
                class="delete-task"
                :placeholder="`&quot;${modalStore.modalTask?.title}&quot;`"
                v-model="deleteTaskTitle"
              />
              <div class="delete-task__button-container">
                <BButton
                  class="task-detail__delete-button"
                  variant="primary"
                  @click="modalStore.closeConfirmModal"
                  aria-label="Cancel deletion"
                >
                  Cancel
                </BButton>
                <BButton
                  class="task-detail__delete-button"
                  :variant="
                    deleteTaskTitle !== modalStore.modalTask?.title ? 'outline-danger' : 'danger'
                  "
                  @click="async () => await deleteMutateAsync()"
                  aria-label="Confirm deletion"
                  :disabled="deleteTaskTitle !== modalStore.modalTask?.title"
                  :aria-disabled="deleteTaskTitle !== modalStore.modalTask?.title"
                >
                  Delete
                </BButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<style lang="scss" scoped>
.v-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  .modal__close-button {
    position: absolute;
    top: 0;
    right: 0;
    background-color: transparent;
    & .modal__close-icon {
      font-size: 1.5rem;
    }
  }
  .modal__overlay {
    background-color: #00000050;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
  }
  .modal__container {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    width: 768px;
    max-width: 80%;
    height: 640px;
    max-height: 95%;
    padding: 1rem 2rem 2rem;
    background-color: white;
    border-radius: 6px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
    gap: 1.5rem;
  }
  .modal__body {
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;

    dl {
      width: 100%;
      text-align: center;
      margin: 0;
    }
    dt {
      width: 100%;
      padding: 10px 0;
      background-color: #dadada;
      border-bottom: 1px solid #dadada;
      border: 1px solid #dadada;
      display: flex;
      justify-content: center;
      .task-editable__button {
        padding: 0 0.2rem;
        background-color: transparent;
        justify-self: flex-end;
        &:hover {
          color: rgb(115, 126, 136);
        }
      }
    }
    dd {
      width: 100%;
      padding: 10px 0;
      background-color: #f3f3f3;
      margin: 0;
      border-left: 1px solid #dadada;
      border-right: 1px solid #dadada;
      display: flex;
      justify-content: center;
      &:last-child {
        border-bottom: 1px solid #dadada;
      }
      .task-editable__text {
        padding: 3px 0;
      }
      .task-editable__input {
        width: 90%;
      }
    }
  }
  .task-detail__button-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    .task-detail__save-button {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }
  }
  .task-detail__delete-button {
    align-self: flex-end;
  }
  &.confirm-deletion {
    .modal__container {
      max-width: 72%;
      max-height: 60%;
    }
    .modal__body {
      display: flex;
      flex-direction: column;
    }
    .modal__title {
      font-size: 1.2rem;
    }
    .delete-form {
      width: 100%;
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .delete-task {
        width: 100%;
      }
      .delete-task__button-container {
        width: 100%;
        align-self: center;
        justify-content: center;
        display: flex;
        gap: 1rem;
      }
    }
  }
  @media screen and (min-width: 768px) {
    .modal__container {
      height: 370px;
      max-height: 80%;
      padding: 3.5rem 2rem 1rem;
      gap: 1rem;
    }
    .modal__body {
      dl {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        text-align: center;
      }
      dt {
        width: 20%;
        padding: 10px 0;
        background-color: #dadada;
        border-bottom: 1px solid #dadada;
        &:first-child {
          border-top: 1px solid #dadada;
        }
      }
      dd {
        width: 80%;
        padding: 10px 0;
        background-color: #f3f3f3;
        margin: 0;
        border-bottom: 1px solid #dadada;
        border-left: 1px solid #dadada;
      }
    }
    &.confirm-deletion {
      .modal__container {
        max-height: 30%;
      }
      .modal__title {
        font-size: 1.5rem;
      }
      .delete-form {
        width: 80%;
        .delete-task__button-container {
          justify-content: flex-end;
        }
      }
    }
  }
}
.confirm-deletion-enter-active,
.confirm-deletion-leave-active {
  transition: opacity 0.5s 0.2s ease;
}

.confirm-deletion-enter-from,
.confirm-deletion-leave-to {
  opacity: 0;
}
</style>
