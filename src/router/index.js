import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: { layout: 'empty' },
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: { layout: 'empty' },
    component: () => import('../views/Register.vue')
  },
  {
    path: '/',
    name: 'home',
    meta: { layout: 'main', auth: true }, // поле auth для реализации доступа к данному роутту только у авторизированного пользователя
    component: () => import('../views/Home.vue')
  },
  {
    path: '/categories',
    name: 'categories',
    meta: { layout: 'main', auth: true },
    component: () => import('../views/Categories.vue')
  },
  {
    path: '/detail/:id', // !!!!Смотреть документацию Динамические пути $route.params. Параметр id , получен автоматически vue.js из файербэйз, А имя 'id' мы ему сами присвоили. Отображаеться он в строке браузера открытой страницы. Пример: http://localhost:8080/detail/-MkhRKq1GXqnXN4iMjlW   -в конце и есть наш id
    name: 'detail',
    meta: { layout: 'main', auth: true },
    component: () => import('../views/Detail.vue')
  },
  {
    path: '/history',
    name: 'history',
    meta: { layout: 'main', auth: true },
    component: () => import('../views/History.vue')
  },
  {
    path: '/planning',
    name: 'planning',
    meta: { layout: 'main', auth: true },
    component: () => import('../views/Planning.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    meta: { layout: 'main', auth: true },
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/record',
    name: 'record',
    meta: { layout: 'main', auth: true },
    component: () => import('../views/Record.vue')
  }





]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => { // вызывается перед каждым роутом
  const currentUser = firebase.auth().currentUser // проверяем если что то в файербейз у текущего пользователя в поле currentuser
  const requireAuth = to.matched.some(record => record.meta.auth)//проверяем требует ли  роут куда мы идем('to') авторизации 
  // если в переменную записываем булевый результат то в имени добавляем 'is' напрмер isRequireAuth
  if (requireAuth && !currentUser) { // если роут требует аворизации и нет текущего пользователя в базе
    next('/login?message=login') // то направляем пользователя на стр.логина и даем сообщение 
  } else {
    next() // в ином случае пускаем пользователя на ту стр. куда он собрался
  }
})
// парамаметр 'to' - это куда мы идем, 'from' - откуда пришли , 
//'next' - функция которая выполняетсяся для продолжения пути или перенаправления на др.путь, например на страницу Логина
export default router
