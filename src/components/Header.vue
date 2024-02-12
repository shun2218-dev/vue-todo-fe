<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { SIGN_OUT } from '../utils/SIGN_OUT';
import { onMounted, ref } from 'vue';
import { useScrollStore } from '../stores/scroll';

const userStore = useUserStore();
const router = useRouter();
const scrollStore = useScrollStore();
const headerHeight = ref<number>(0);
onMounted(() => {
  headerHeight.value = document.querySelector('.header')?.clientHeight ?? 0;
});
</script>
<template>
  <header class="header">
    <BNavbar
      variant="primary"
      v-b-color-mode="'dark'"
      :class="{ 'px-xs-2': true, 'px-sm-5': true, 'fixed-top': scrollStore.y > headerHeight }"
    >
      <BNavbarBrand tag="h1" class="mb-0">Vue Todo App</BNavbarBrand>
      <BNavbarNav>
        <BNavItem href="#" @click.prevent="async () => await router.push('/list')">Home</BNavItem>
        <BNavItemDropdown text="User" right v-if="userStore.isLoggedIn">
          <BDropdownItem href="#" @click.prevent="async () => await SIGN_OUT()">
            Sign out
          </BDropdownItem>
        </BNavItemDropdown>
      </BNavbarNav>
    </BNavbar>
  </header>
</template>
<style scoped lang="scss"></style>
