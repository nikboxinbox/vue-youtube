import firebase from 'firebase/app'

export default {
  actions: {
    async createRecord({ dispatch, commit }, record) {
      try { // выполняется в случае если у нас нет ошибок
        const uid = await dispatch('getUid')
        return await firebase.database().ref(`/users/${uid}/records`).push(record)
        //record это обьект который мы получилли из Record.vue методом dispatch
        //ВАЖНО! мы не только записали данные в firebase, но также сделали return.
      } catch (error) {
        commit('setError', error)
        throw error 
      }
    },
    async fetchRecords({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')
        const records = (await firebase.database().ref(`/users/${uid}/records`).once('value')).val() || {} // получаем данные из файербейз , и если в поле records нет ничего то получаем пустой обьект 
        const res = Object.keys(records).map(key => ({ ...records[key], id: key }))// получили массив с обьектамии , у которых почвилось поле id и записали туда значенеие key
        
        return res
      } catch (error) {
        commit('setError', error)
        throw error
      }
    },
    async fetchRecordById({dispatch, commit}, id) {
      try {
        const uid = await dispatch('getUid')
        
        const record =  (await firebase.database().ref(`/users/${uid}/records`).child(id).once('value')).val() || {}
        return {...record, id} // 'id' сокращение от 'id: id'возвращаем record и записываем в поле id полученное значение id . 
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}
//child(id) - получаем по id доступ к элементу
//return Object.keys(records).map(key => ({ ...records[key], id: key }))- 
// Метод Object.keys() возвращает массив из собственных перечисляемых свойств переданного объекта
// JavaScript метод map() позволяет вызвать переданную функцию один раз для каждого элемента массива,
//  формируя новый массив из результатов вызова этой функции.