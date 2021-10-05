<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas></canvas>
    </div>

   <Loader v-if="loading" />   <!-- если loading: true , показываем лоадер -->

   <p class="center" v-else-if="!records.length">   <!--если массив records пуст то показываем эту запись -->
      Записей пока нет.
      <router-link to="/record">Добавьте первую</router-link>
    </p>

    <section v-else> <!--  если loading: false и массив records имеет записи то показываем данный section -->
      <HistoryTable :records="records" /> <!-- Передаем в компонент HistoryTable records и именуем так же -->
    </section>
  </div>
</template>

<script>
import HistoryTable from '@/components/HistoryTable'

export default {
  name: 'history',
  data: () => ({
    loading: true,
    records: [],
    categories: [],
  }),
  async mounted() {
    // this.records = await this.$store.dispatch('fetchRecords')
    const records = await this.$store.dispatch('fetchRecords');
    this.categoires = await this.$store.dispatch('fetchCategories');
    this.records = records.map((record) => { // на каждой итерации будем получать некоторый record из массива records
      return {
        ...record, // разворачивавем объект record и определяем для него необходимые нам поля ниже
        categoryName: this.categoires.find((c) => c.id === record.categoryId) .title, //находим имя той категории чей id совпадает с id записи
        typeClass: record.type === 'income' ? 'green' : 'red', // определяем тип приход (income) у нас или нет и прсваиваем значение 'green' или 'red',
        typeText: record.type === 'income' ? 'Доход' : 'Расход' // Типы income/outcome это типы записи расход/приход которые выбирает пользоваетль радиокнопкой при создании записи
       }; 
    });
    this.loading = false; //после получения и обработки данных убираем лоадинг
  
  },
  
  components: {
    HistoryTable,
  },
};
</script>
