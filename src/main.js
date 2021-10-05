import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import router from './router'
import store from './store'
import dateFilter from '@/filters/date.filter'
import messagePlugin from '@/utils/message.plugin'
import './registerServiceWorker'
import Loader from '@/components/app/Loader'
import 'materialize-css/dist/js/materialize.min'
import tooltipDirective from './directives/tooltip.directive'
import currencyFilter from '@/filters/currency.filter'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.config.productionTip = false
Vue.directive('tooltip', tooltipDirective) //в скобах название и значение
Vue.component('Loader', Loader)
Vue.use(messagePlugin)
Vue.use(Vuelidate)
Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)


firebase.initializeApp({
  apiKey: "AIzaSyDGtoKw_BYfmRgJ0KjuKHwuajN7kDp9ZTI",
  authDomain: "my-vue-c6a33.firebaseapp.com",
  databaseURL: "https://my-vue-c6a33-default-rtdb.firebaseio.com",
  projectId: "my-vue-c6a33",
  storageBucket: "my-vue-c6a33.appspot.com",
  messagingSenderId: "457217700390",
  appId: "1:457217700390:web:30d4ee9b19159a5bd22ce7",
  measurementId: "G-NHNQGRL6YR"
})

let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})