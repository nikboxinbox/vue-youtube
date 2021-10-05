<template>
  <div>
    <div class="page-title">
      <h3>Категории</h3>
    </div>
    <section>
      <Loader v-if="loading" />
      <!-- запускаем лоадер в случае если созданный в data 'loading' true -->
      <div class="row" v-else>
        <CategoryCreate @created="addNewCategory" />
       <!-- @created="addNewCategory" - Слушаем событие created из компонента  CategoryCreate.vue и
       выполняем метод addNewCategory -->

        <CategoryEdit
          v-if="categories.length" 
          :categories="categories" 
          :key="categories.length + updateCount"
          @updated="updateCategories"
        />
         <!-- v-if="categories.length" если в массиве categories что то есть , то компонент CategoryEdit отображается  -->
         
         <!-- @updated="updateCategories" слушаем событие  updated которое транслируется через $emit в CategoryEdit
         и запускаем метод updateCategories -->
        <p v-else class="center">Категорий пока нет</p>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate';
import CategoryEdit from '@/components/CategoryEdit';

export default {
  name: 'categories',
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0,
  }),
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories');
    this.loading = false;
  },
  components: {
    CategoryCreate,
    CategoryEdit,
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category);
    },
    updateCategories(category) {
      const idx = this.categories.findIndex((c) => c.id === category.id);
      // findIndex - находим индекс элемента массива this.categories который
      // соответствует условию в скобках , а именно равен id входящему  аргументу category
      this.categories[idx].title = category.title;
      this.categories[idx].limit = category.limit;
      this.updateCount++;
    },
  },
};
</script>
