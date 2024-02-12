import { useUserStore } from './stores/user';
import { RouteRecordRaw, Router, createRouter, createWebHashHistory } from 'vue-router';
import TaskListPage from './pages/TaskListPage.vue';
import CreateTaskPage from './pages/CreateTaskPage.vue';
import LoginPage from './pages/LoginPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import TopPage from './pages/TopPage.vue';
import RegisterProfilePage from './pages/RegisterProfilePage.vue';

const freeRoutes = ['top', 'login', 'register', 'register-profile'];
export const routerGuard = (router: Router) => {
  const userStore = useUserStore();
  router.beforeEach((to, _, next) => {
    const needNotAuthenticated = freeRoutes.some((route) => route.includes(to.name! as string));
    if (userStore.isLoggedIn || needNotAuthenticated) next();
    else next({ name: 'login' });
  });
};

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'top',
    component: TopPage,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
  },
  {
    path: '/register/profile',
    name: 'register-profile',
    component: RegisterProfilePage,
    beforeEnter: (to) => {
      if (!to?.query?.auth_key) return '/register';
    },
  },
  {
    path: '/list',
    name: 'task-list',
    component: TaskListPage,
  },
  {
    path: '/create',
    name: 'create-task',
    component: CreateTaskPage,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
