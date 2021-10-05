export default {
  bind(el, { value }) { // el - элемнт DOM в который добавляем директиву тултип, value значение(поле) некоторого обьекта
    M.Tooltip.init(el, { html: value }) // M.Tooltip нужно зарегить в main.js
  },
  unbind(el) { // unbind метод аналогичный методу destroyed уничтожаем тултипы
    const tooltip = M.Tooltip.getInstance(el)

    if (tooltip && tooltip.destroy) { // если у тул типа есть метод дестрой то применяем этот метод
      tooltip.destroy()
    }
  }
}
//При переходе на др. страницу все созданные в html тултипы уничтожаться ,благодаря destroy
