<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const progress = ref<number>(0);
const isReady = ref<boolean>(false);
const autoDismissingAlert = ref(5000);
const autoDismissingAlertInterval = ref(1000);
const autoDismissingAlertCountdown = ref(0);
const router = useRouter();
const userStore = useUserStore();

let progressTimer = setInterval(() => {
  if (progress.value === 100) {
    clearInterval(progressTimer);
  } else {
    progress.value += 1;
  }
}, 50);
watch(progress, (next) => {
  if (next === 100) {
    isReady.value = true;
  }
});
watch(autoDismissingAlertCountdown, async (next) => {
  if (next === 0) {
    if (userStore.isLoggedIn) {
      await router.push('/list');
    } else {
      await router.push('/login');
    }
  }
});
</script>
<template>
  <main class="main-content">
    <div class="container">
      <h1>To Do List</h1>
      <div class="progress-wrapper">
        <BProgress :max="100" height="1.2rem" :value="progress" class="" />
      </div>
      <div v-if="progress === 100" class="progress-value">Load Complete!{{ progress }}%</div>
      <div v-else class="progress-value">Page Loading...{{ progress }}%</div>
      <BAlert
        variant="success"
        v-if="isReady"
        class="redirect-counter"
        v-model="autoDismissingAlert"
        :interval="autoDismissingAlertInterval"
        @close-countdown="autoDismissingAlertCountdown = $event"
      >
        Automatically, redirect to login page {{ autoDismissingAlertCountdown / 1000 }} seconds
        later...
      </BAlert>
      <div v-else-if="autoDismissingAlertCountdown === 0" class="redirect-counter">
        Automatically, redirect to login page right now!
      </div>
      <div v-if="autoDismissingAlertCountdown === 0" class="link-container">
        <span>
          Don't you have a account yet?
          <router-link to="/register">Create Account</router-link>
        </span>
        <span>Already have a account? <router-link to="/login">Sign In</router-link></span>
      </div>
    </div>
  </main>
</template>
<style scoped lang="scss">
.progress-wrapper {
  margin: 2rem 0;
}
.progress-value {
  font-size: 2rem;
}
.redirect-counter {
  font-size: 1.5rem;
}
.link-container {
  display: flex;
  flex-direction: column;
}
</style>
