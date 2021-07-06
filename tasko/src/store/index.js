import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    info:{
      proyecto:'',
      proyectos:[],
      Imagen:''
    }
  },
  getters: {
    getName: state=>{
      return state.info.proyecto
    },
    getProjects: state=>{
      return state.info.proyectos
    },
    getImagen: state=>{
      return state.info.Imagen
    }
  },
  mutations: {
    change(state,payload){
      state.info.proyecto = payload
    },
    setImage(state,image){
      state.info.Imagen = image
    },
    setProjects(state,projects){
      state.info.proyectos = projects
    }
  },
  actions: {},
  modules: {},
});
