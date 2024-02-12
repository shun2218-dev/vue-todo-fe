import { createApp } from 'vue';
import { BootstrapVueNext } from 'bootstrap-vue-next';
import './style.scss';
import App from './App.vue';
import { QueryClient, VueQueryPlugin, VueQueryPluginOptions } from '@tanstack/vue-query';
import { router, routerGuard } from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

const pinia = createPinia();
const app = createApp(App);

export const queryClient = new QueryClient();
const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClient,
};

pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(VueQueryPlugin, vueQueryPluginOptions);
app.use(BootstrapVueNext);
routerGuard(router);
app.use(router);
app.mount('#app');
