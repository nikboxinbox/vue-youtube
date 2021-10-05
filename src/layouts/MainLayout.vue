<template>
  <div class="">
    <Loader v-if="loading" /> <!--  Проверяем loading созданный в data -->
    <div class="app-main-layout" v-else>
      <Navbar @click="isOpen = !isOpen" />

      <Sidebar v-model="isOpen" />

      <main class="app-content" :class="{ full: !isOpen }">
        <div class="app-page">
          <router-view />
        </div>
      </main>

      <div class="fixed-action-btn">
        <router-link class="btn-floating btn-large blue" to="/record" v-tooltip="'Создать новую запись'">
          <i class="large material-icons">add</i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/app/Navbar';
import Sidebar from '@/components/app/Sidebar';
import messages from '@/utils/messages'
export default {
  name: 'main-layout',
  data: () => ({
    isOpen: true,
    loading: true, // Создали данную переменную для проверки , а загрузилась инфа с сервера ? - в методе mounted. 
  }),
  //!!! ВАЖНО !!! Все асинхронные запросы луччше делать в метод mounted
  // Ниже делаем запрос на получение данных с сервера о юзере. Делаем это в
  // MainLayout т.к данные нам нужны сразу при загрузке этого лайаута

  async mounted() {
    // Проверяем наличие данных в свойстве info, обьекта state,(./info.js) обращаясь через созданный нами getter 'info'.
    // ПРИМЕР работы Object.keys :
    // var arr = ['a', 'b', 'c'];
    //console.log(Object.keys(arr));  консоль: ['0', '1', '2']
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo'); // запускаем action 'fetchInfo' (./info.js).
      this.loading = false 
    }
  },
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    error(fbError) {
      this.$error(messages[fbError.code] || 'Что-то пошло не так')
    }
  },
  components: {
    Navbar,
    Sidebar,
  },
};
</script>