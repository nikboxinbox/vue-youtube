<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>
    <Loader v-if="loading" />
    <!-- если !categories.length - если не равно нулю. Т.е в категориях что то есть -->
    <p class="center" v-else-if="!categories.length">
      Категорий пока нет.
      <router-link to="/categories">Добавить новую категорию</router-link>
    </p>

    <form class="form" v-else @submit.prevent="handleSubmit">
      <div class="input-field">
        <!-- v-model="category" модель для отслеживания изменения селекта(выбор категории юзером из списка) -->
        <select ref="select" v-model="category">
          <!--<option> - определяет отдельные пункты списка, создаваемого с помощью контейнера <select>. -->
          <!-- value Определяет значение элемента формы, которое будет отправлено на сервер или получено с помощью клиентских скриптов -->
          <!--ВАЖНО! :value="c.id"  - обращаться к категории мы будем  по id -->
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.title }}
          </option>
        </select>
        <label>Выберите категорию</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>Доход</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>Расход</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{ invalid: $v.amount.$dirty && !$v.amount.minValue }"
        />
        <!--.number позволяет автоматически конвертировать при вводе вводимое значение в число -->
        <label for="amount">Сумма</label>
        <span
          v-if="$v.amount.$dirty && !$v.amount.minValue"
          class="helper-text invalid"
        >
          Минимальная значение {{ $v.amount.$params.minValue.min }}
        </span>
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{
            invalid: $v.description.$dirty && !$v.description.required,
          }"
        />
        <label for="description">Описание</label>
        <span
          v-if="$v.description.$dirty && !$v.description.required"
          class="helper-text invalid"
        >
          Введите описание
        </span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Создать
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import Loader from '../components/app/Loader.vue';
import { required, minValue } from 'vuelidate/lib/validators'; // импорт валидаторов из библиотеки vuelidate
import { mapGetters } from 'vuex'; // Функция mapGetters просто проксирует геттеры хранилища в локальные вычисляемые свойства компонента:

export default {
  components: { Loader },
  name: 'record',
  data: () => ({
    loading: true,
    select: null,
    categories: [],
    category: null,
    type: 'outcome', // (расход) модель  радиокнопки по умолчанию . outcome/income указано в value кнопок
    amount: 1, // сумма которую мы указываем в  текущей записи
    description: '', // модель для поля "Описание"
  }),
  validations: {
    amount: { minValue: minValue(1) },
    description: { required },
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories');
    this.loading = false;
    // делаем задержку на отображение селект, указываем'0' но тем не менее это срабатывает , в противном случае селект не подгружался вовремя
    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.select); // оживляем select библиотека MaterializeCss
      M.updateTextFields(); // updateTextFields обновляем текст поля для того чтобы при входе на данную страницу они отображали корректно мин.значения или текст по умолчанию
    }, 0);
    // ниже делаем так чтобы , при условии , что категории имеются , отображалась по умолчанию в списке самая первая
    // присваиваем модели category значение id первого элемента в массиве categories согласно заданого value в select/option
    if (this.categories.length) {
      this.category = this.categories[0].id;
    }
  },
  computed: {
    ...mapGetters(['info']), //? получаем доступ к  геттеру info
    canCreateRecord() {
      // Проверка счета юзера
      if (this.type === 'income') {
        //если радиокнопка выбрана income т.е поступление, то ок!
        return true;
      }
      return this.info.bill >= this.amount;
    },
  },

  methods: {
    async handleSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      if (this.canCreateRecord) {
        try {
       await this.$store.dispatch('createRecord', { // Внесение данных новой записи приход или расход в файербэйз
            categoryId: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON(),
          });
          const bill =   // Константа куда вычислим и запишем значение счета учитывая запись о расходе/доходе.
            this.type === 'income' // если тип это income- доход
              ? this.info.bill + this.amount// тогда текущий счет плюс сумма указаная в поле "Сумма"
              : this.info.bill - this.amount;// в противном случае мы от текущего счета  отнимаем указанную сумму
          await this.$store.dispatch('updateInfo', { bill }); // запустим экшн updateInfo из /info.js , что бы обновить данные о счете в store и файербэйз после записи доход/расход. передаем константу с новым счетом  "bill"
          this.$message('Запись успешно создана'); // вызываем нами созданный плагин с сообщением для юзера.
          this.$v.$reset(); //?(узнать подробнее) очищаем поля ввода
          this.amount = 1; // возвращаем полю Сумма значение "1" как и делали по умолчанию
          this.description = '';// в поле Описание делаем пустую строку 
        } catch (e) {}
      } else {
        this.$message(
          `Недостаточно средств на счете (${this.amount - this.info.bill})`
        );
      }
    },
  },
  destroyed() {
    // очищаем память от плагина M.FormSelect
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
};
</script>

