import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HeroView from '../views/HeroView.vue'
import ChatView from '../views/ChatView.vue'
import { getCurrentUser } from 'vuefire'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
     {
      title: 'Login Page',
      path: '/login',
      name: 'Login',
      component : () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      component: HomeView,
      children: [
        {
          title: 'Home',
          path: '/',
          name: 'home',
          props: {
            default: true
          },
          component: HeroView
        },
        {
          title: 'Chat',
          path: '/chat/:chat',
          name: 'chat',
          props: {
            default: true
          },
          component: ChatView
        },
      ]
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
