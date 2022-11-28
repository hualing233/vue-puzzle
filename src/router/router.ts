import { createRouter, createWebHashHistory } from 'vue-router';

import Home from '../pages/home.vue';
import Play from '../pages/play.vue';

const routes = [
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/play',
    component: Play,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
