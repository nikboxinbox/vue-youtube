<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Редактировать</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="c of categories" :key="c.id" :value="c.id">
              {{ c.title }}
            </option>
          </select>
          <label>Выберите категорию</label>
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="title"
            :class="{ invalid: $v.title.$dirty && !$v.title.required }"
          />
          <label for="name">Название</label>
          <span
            v-if="$v.title.$dirty && !$v.title.required"
            class="helper-text invalid"
          >
            Введите название категории
          </span>
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{ invalid: $v.limit.$dirty && !$v.limit.minValue }"
          />
          <label for="limit">Лимит</label>
          <span
            v-if="$v.limit.$dirty && !$v.limit.minValue"
            class="helper-text invalid"
          >
            Минимальная значение {{ $v.limit.$params.minValue.min }}
          </span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Обновить
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators';

export default {
  props: {
    categories: {
      type: Array, // ВАЖНО! передаваеммые данные обязательно должны быть типа массив
      required: true, // делает так что бы компонент выдал ошибку если не будут переданны данные categories.
    },
  },
  // Получаем из props объект categories который передается из род.элемента Categories. директивой v-bind
  data: () => ({
    select: null,
    title: '',
    limit: 100,
    current: null,
  }),
  validations: {
    title: { required },
    limit: { minValue: minValue(100) },
  }, 
  watch: {  // watch следит  за  изменениями в модели. и каждый раз когда будет какое либо изменение , будет выполняться назначеная ниже функция
    current(catId) { // 
      const { title, limit } = this.categories.find(
        (category) => category.id === catId
      );
      this.title = title;
      this.limit = limit;
    },
  },
  created() {
    const { id, title, limit } = this.categories[0];
    this.current = id;
    this.title = title;
    this.limit = limit;
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      try {
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit,
        };
        await this.$store.dispatch('updateCategory', categoryData);
        this.$message('Категория упешно обновлена');
        this.$emit('updated', categoryData);
      } catch (e) {}
    },
  },
  mounted() {
    this.select = M.FormSelect.init(this.$refs.select);
    M.updateTextFields();
  },
  destroyed() {
    // очищаем память от плагина M.FormSelect
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
};

// ! v-model="title" !  тоже самое что и v-bind:value="title" @input="title = $event"(v-model - это упрощеная запись)
//           v-model="title" input мы получаем в title значение введеное в поле.
//            Мы привязали инпут к свойству title и без обработчика событий на ввод получаем данные в title-  -->

// ! watch , current ! наблюдатель за нашей моделью current который будет реагировать одноименной
// созданной нами функцией на каждое изменение в этой модели.

// ! created ! В хуке created вы сможете получить доступ к реактивным данным и активным событиям.
//Шаблоны и виртуальный DOM ещё не встроены (mounted) и не отрисованы.
// Таким образом ниже , мы присвоили  моделям полей нашей категории начальное значения первого в списке элемента

// ! refs/ref ! С помощью параметра refs можно ссылаться на определенный html-элемент из шаблона и управлять им. обращаемся через $refs.
// Для этого надо задать атрибут с указаным здесь именем нужному тегу html

// ! this.$emit('updated', categoryData)! транслируем данное событие для Categories.vue,
// что бы обновлять не только данные на сервере но и локальные. Передаем обьект categoryData
// А на странице Categories.vue мы будем слушать данное событие при помощи v-on и там же обрабатывать создав метод
</script>
 


