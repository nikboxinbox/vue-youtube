import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    meta: { layout: 'empty' },
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/categories',
    meta: { layout: 'main' },
    name: 'categories',
    component: () => import('../views/Categories.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router