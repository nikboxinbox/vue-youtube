// В данном модуле содержиться логика необходимая для регистрации, входа и выхода из системы
import firebase from 'firebase/app'

export default {
  // login - вход в приложение.{dispatch, commit}- методы которые планируем использовать в функции и 
  // {email, password} аргументы.
  actions: {
    async login({ dispatch, commit }, { email, password }) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password) //firebase сверяет почту пароль
        //firebase сверяет почту пароль и если логин проходит проверку то возвращает некоторые данные юзера.
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async register({ dispatch, commit }, { email, password, name }) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        const uid = await dispatch('getUid')
        // Ниже создаем поле в файербэйз info и добавляем в него bill и name
        await firebase.database().ref(`/users/${uid}/info`).set({ // !!!ВАЖНО благодаря - set , если мы прописываем несуществующий путь , то он создаётся
          bill: 10000,
          name
        })
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    getUid() {
      const user = firebase.auth().currentUser
      return user ? user.uid : null
    },
    async logout({ commit }) {
      await firebase.auth().signOut()
      commit('clearInfo')
    }
  }
}