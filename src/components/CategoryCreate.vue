<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Создать</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <!-- v-model="title" тоже самое что и v-bind:value="title" @input="title = $event"(v-model - это упрощеная запись)
          v-model="title" input мы получаем в title значение введеное в поле. 
           Мы привязали инпут к свойству title и без обработчика событий на ввод получаем данные в title-  -->
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
          Создать
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators';

export default {
  data: () => ({
    title: '',
    limit: 100,
  }),
  // Ниже описываются правила валидации
  validations: {
    title: { required },
    limit: { minValue: minValue(100) },
  },
  mounted() {
    M.updateTextFields();
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch(); //??$touch
        return;
      }
      try {
        const category = await this.$store.dispatch('createCategory', {
          title: this.title,
          limit: this.limit,
        });
        this.title = '';
        this.limit = 100;
        this.$v.$reset();
        this.$message('Категория была создана');
        this.$emit('created', category);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>