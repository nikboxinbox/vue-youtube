import firebase from 'firebase/app'

export default {
  state: {
    info: {}  // Информация о юзерах
  },
  mutations: {
    setInfo(state, info) {
      state.info = info
    },
    clearInfo(state) {
      state.info = {}
    }
  },
  actions: {
    async updateInfo({ dispatch, commit, getters }, toUpdate) { //Получаем обьект - toUpdate 
      //в котором даные совпадающие по ключам с базой данных . Необходимые для обновления 
       try {
        const uid = await dispatch('getUid')
        const updateData = { ...getters.info, ...toUpdate } //??? "..."
        await firebase.database().ref(`/users/${uid}/info`).update(updateData)//получаем обновленные данные в обьект updateData
        commit('setInfo', updateData) // и вызываем мутацию для изменения данных  в store 
      } catch (error) {
        commit('setError', error)
        throw error
      }
    },

    async fetchInfo({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')// Запускаем экшн 'getUid'созданный в ./auth.js и получаем uid юзера.
        const info = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val() // Получаем данные пользователя из базы даных
        // firebase.database() - обращаемся к базе данных файербэйс.
        // ref(`/users/${uid}/info`) - указываем путь в таблицу пользователя(${uid}) на файербэйс в поле  info
        commit('setInfo', info) // вызываем мутацию "setInfo" , передавая данные записаные в const info
      } catch (error) {
        commit('setError', error)
        throw error
      }
    }
  },
  getters: {
    info: s => s.info 
  }
}