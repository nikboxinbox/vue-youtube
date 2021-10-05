<template>
  <div>
    <div class="page-title">
      <h3>Планирование</h3>
      <h4>{{ info.bill | currency('RUB') }}</h4>
      <!-- благодаря импорту { mapGetters }  и  computed: {...mapGetters(['info'])
       мы можем использовать здесь такие данные как info.bill 
       Функция mapGetters просто проксирует(прокидывает) геттеры хранилища в локальные вычисляемые свойства компонента:-->
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">
      Категорий пока нет.
      <router-link to="/categories">Добавить новую категорию</router-link>
    </p>

    <section v-else>
      <div v-for="cat of categories" :key="cat.id"> 
        <p>
          <strong>{{ cat.title }}:</strong>
          {{ cat.spend | currency }} из {{ cat.limit | currency }}
        </p>
        <!-- cat.spend это сколько денег в данной категории потрачено. currency - это фильтр добавляет нам значек валюты -->
        <div class="progress" v-tooltip="cat.tooltip"> 
          <!-- v-tooltip - нами созданная директива из библиотеки материалайз в папке directives -->
          <div
            class="determinate"
            :class="[cat.progressColor]"
            :style="{ width: cat.progressPercent + '%' }"
          ></div>
          <!-- progressColor , progressPercent - созданнs в mounted Ширина данного div ,в процентах как и значение progressPercent-->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import currencyFilter from '@/filters/currency.filter';
export default {
  name: 'planning',
  data: () => ({
    loading: true,
    categories: [],
  }),
  computed: {
    ...mapGetters(['info']), // теперь у нас есть info  и то что в нем. 
    // !!! Так же можно использовать пример:  mapActions но т.к actions это методы то и пишем их в методах а не в computed.
  },
  //mounted() метод который исполняеться при загрузке страницы без наших доп.вызовов
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords'); // мы получили массив с обьектами , это записи всех категорий.
    const categoires = await this.$store.dispatch('fetchCategories');// получаем массив с обьектами.Это категории с title,id,limit.
    this.categories = categoires.map((cat) => { //Метод map() создаёт новый массив с результатом вызова указанной функции для каждого элемента массива.
      const spend = records// (spend - перевод: траты) //Метод filter возращает нам массив
        .filter((r) => r.categoryId === cat.id) //отбираем те рекорд(запись) id которых совпадает с 'cat.id' затем идем к фильтру ниже
        .filter((r) => r.type === 'outcome')// отбираем те записи из records тип которых "outcome" т.е расход
        .reduce((total, record) => { return (total += +record.amount); }, 0); //(total, record) это аргументы функции callback а доп. плюс перед record.amount для того чтобы суммировать числа а не конкатинировать.
        //метод reduce применяет функцию к каждому элементу массива.Начинать мы будем с нуля.
        //total это общее значение которое на каждой итерации будет изменятся.К текущей итерации у нас относится некотрый record
        //record.amount  сумма  данного record, т.е сумма записи
      const percent = (100 * spend) / cat.limit; //считаем процент трат от заданного лимита (в рамках этой функции это cat.limit) 
      const progressPercent = percent > 100 ? 100 : percent;//проверяем процент трат. Не вышел ли он за возможный максимум в 100%
      const progressColor = // задаем значения  цвета прогрессбара в зависимости от процента.
        percent < 60 ? 'green' : percent < 100 ? 'yellow' : 'red';

      const tooltipValue = cat.limit - spend; // вычисляем значение тултип из лимита отнимаем расход.
      const tooltip = `${
        tooltipValue < 0 ? 'Превышение на' : 'Осталось'
      } ${currencyFilter(Math.abs(tooltipValue))}`; // Math.abs - возвращает абсолют числа, число без минуса.
    
      return {
        ...cat, //возвращаем все значения cat благодаря оператору '...'(spred)
        progressPercent, //процент трат
        progressColor,// цвет прогресс бара
        spend,// сумма трат
        tooltip,
// Возвращает наша функция возвращает новый  обьект с данными cat ( progressPercent, progressColor, spend )вместо тех которые были из файербэйз

      };
    });

    this.loading = false;
  },
};
</script>