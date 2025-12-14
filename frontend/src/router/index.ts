import { createRouter, createWebHistory } from 'vue-router'
import ExplorerView from '../views/ExplorerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ExplorerView,
    },
  ],
})

export default router
