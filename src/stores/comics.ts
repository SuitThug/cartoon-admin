import { defineStore } from 'pinia'

let comicsStore = defineStore('comics', {
    state:():any => {
        return {
            comicsId:localStorage.getItem('comicsId'),
            chapterId:localStorage.getItem('chapterId'),
            editORAdd:{}
        }
    },
  })
  export default comicsStore