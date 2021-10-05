<template>
  <div>
    <div class="page-title">
      <h3>Счет</h3>

      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>

    <Loader v-if="loading" />

    <div v-else class="row">
      <HomeBill :rates="currency.rates" />
      <!-- привязываем к :rates значения из обьекта currency.rates которые получили с fixer.io -->

      <HomeCurrency :rates="currency.rates" :date="currency.date" />
    </div>
  </div>
</template>

<script>
import HomeBill from '@/components/HomeBill';
import HomeCurrency from '@/components/HomeCurrensy.vue';
export default {
  name: 'home',
  data: () => ({
    loading: true, //лоадер включен
    currency: null, //курс валют
  }),
  async mounted() {
    this.currency = await this.$store.dispatch('fetchCurrency'); // присваиваем курсу валют значение, вызывая экшн fetchCurrency из index.js
    this.loading = false; // выключаем лоадер
  },
  methods: {
    async refresh() {
      // перезагрузка страницы, срабатывает по клику на кнопку refresh
      this.loading = true; // включаем лоадер
      this.currency = await this.$store.dispatch('fetchCurrency'); // получаем(обновляем) данные валют вызывая экшн fetchCurrency
      this.loading = false; // выключаем лоадер
    },
  },
  components: {
    HomeBill,
    HomeCurrency,
  },
};
</script>
