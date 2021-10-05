<template>
  <div>
    <Loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">История</router-link>
        <a @click.prevent class="breadcrumb"> <!-- данная запись не должна быть ссылкой, и зделана так видимо для дизайна исходя из правил библиотеки MaterializeCss -->
          {{ record.type === 'income' ? 'Доход' : 'Расход' }}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div
            class="card"
            :class="{
              red: record.type === 'outcome',
              green: record.type === 'income',
            }"
          >
            <div class="card-content white-text">
            <p>Описание: {{ record.description }}</p>    <!-- заданное юзером описание категории -->
             <p>Сумма: {{ record.amount | currency }}</p>  <!-- сумма записи и фильтр для указания влюты -->
            <p>Категория: {{ record.categoryName }}</p>   <!-- имя категории которое мы записали в record.categoryName в mounted -->

              <small>{{ record.date | date('datetime') }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center" v-else>Запись с id={{ $route.params.id }} не найдена</p>
  </div>
</template>

<script>
export default {
  name: 'detail',
  data: () => ({
    record: null,
    loading: true,
  }),
  async mounted() { 
    const id = this.$route.params.id; //
    const record = await this.$store.dispatch('fetchRecordById', id); // вызываем экшн fetchRecordById в .store/categoty.js и передаем полученный строчкой выше const id 
    const category = await this.$store.dispatch('fetchCategoryById',record.categoryId);

    this.record = {  // Здесь мы обращаемся к модели record созданной в data и помещаем туда значение const record 
      ...record, 
      categoryName: category.title, // благодаря spred ...' создаем в record поле categoryName и присваиваем 'category.title'
    };

    this.loading = false;
  },
};
</script>
