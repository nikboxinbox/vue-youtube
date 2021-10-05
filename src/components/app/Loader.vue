<template>
  <div class="app-loader">
    <div class="preloader-wrapper active">
      <div class="spinner-layer" :class="color">  <!-- Цвет color это значение computed полученное рандомно ниже в коде. -->
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    // получим методом случайных чисел(Math.random) и округлим Math.floor номер элемента массива и подставим его в класс цвета лоадера
    color() {
      const colors = [
        'spinner-red-only',
        'spinner-blue-only',
        'spinner-green-only',
      ];
      return colors[Math.floor(Math.random() * 3)];
    },
  },
};
</script>