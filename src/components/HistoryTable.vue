<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Сумма</th>
        <th>Дата</th>
        <th>Категория</th>
        <th>Тип</th>
        <th>Открыть</th>
      </tr>
    </thead>

    <tbody>
    <tr v-for="(record, idx) of records" :key="record.id">    <!--(tr - строка)создаем для итерации переменную record и добавляем индекс(idx) .key обязателен -->
        <td>{{ idx + 1 }}</td> 
        <td>{{ record.amount | currency('RUB') }}</td> <!--  (amount сумма ) и фильтр currency -->
        <td>{{ record.date | date('datetime') }}</td>
        <td>{{ record.categoryName }}</td>  <!-- categoryName данное поле в record мы создали на стр. History -->
        <td>
          <span :class="[record.typeClass]" class="white-text badge">{{
            record.typeText
          }}</span>
        </td>
        <td>
          <button
            v-tooltip="'Посмотреть запись'"
            class="btn-small btn"
            @click="$router.push('/detail/' + record.id)"
          >
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    records: {
      required: true, // делаем records обязательным иначе данный компонент вью  не будет отображаться
      type: Array,
    },
  },
};
</script>