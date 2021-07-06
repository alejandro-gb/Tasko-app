<template>
    <div :style="mystyle" class="tipo">
        <h3><input style="width: 100%" class="titulo" type="text"  v-model="newTitle"></h3>
        <textarea class="titulo" name="content" id="content" cols="200" rows="3"  v-model="newText"></textarea>
        <div v-if="!view">
            <h3>{{translatedtitle}}</h3>
            <h5>{{translatedtext}}</h5>
        </div>
        <p>
            <button @click="view = !view" class="titulo">🌎</button>
            <button @click="eliminar()" class="titulo">❌</button>
            <button @click="listen = !listen;escuchar();startLoading()" class="titulo">🔉</button>
            <button @click="guardar()" class="titulo">💾</button>
        </p>

        <div v-if="view">
            <b-form-select v-model="selected" :options="options"></b-form-select>
            <b-button @click="traducir()" variant="info">Translate</b-button>
        </div>

        <div v-if="listen">
            <div>
                <div class="d-flex align-items-center mb-3">
                    <b-progress class="w-100" :max="maxLoadingTime" height="1.5rem">
                        <b-progress-bar :value="loadingTime" :label="`${((loadingTime / maxLoadingTime) * 100).toFixed(2)}%`"></b-progress-bar>
                    </b-progress>
                </div>

            <b-skeleton-wrapper :loading="loading">
                <template #loading>
                        <b-skeleton width="85%"></b-skeleton>
                        <b-skeleton width="55%"></b-skeleton>
                        <b-skeleton width="70%"></b-skeleton>
      </template>
      <b-card>
        <audio :src="audiosrc" controls></audio>
      </b-card>
    </b-skeleton-wrapper>
  </div>
           
            <p></p>
        </div>

    </div>
</template>

<script>
export default {
    name: "Tipo",
    props:{
        titulo: String,
        texto: String,
        color: String,
        num: Number
    },
    mounted(){
        
    },
    data(){
        return{
        translatedtitle:' ',
        loading: false,
        loadingTime: 0,
        maxLoadingTime: 25,
        translatedtext:' ',
        newTitle: this.titulo,
        newText:this.texto,
        view: false,
        listen: false,
        test: false,
        test2:false,
        audiosrc: '',
            mystyle:{
                backgroundColor: this.color
            },
        selected: null,
        options: [
          { value: null, text: 'Please select an option' },
          { value: 'ingles', text: 'English 🌭' },
          { value: 'italiano', text: 'Italian 🍕' },
          { value: 'japones', text: 'Japanese 🍥' },
          { value: 'frances', text: 'French 🥐'},
          { value: 'aleman', text: 'German 🥨'}
        ]
        }
    },
     watch: {
      loading(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.clearLoadingTimeInterval()

          if (newValue) {
            this.$_loadingTimeInterval = setInterval(() => {
              this.loadingTime++
            }, 1000)
          }
        }
      },
      loadingTime(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue === this.maxLoadingTime) {
            this.loading = false
          }
        }
      }
    },
    created() {
      this.$_loadingTimeInterval = null
    },
    methods:{
        clearLoadingTimeInterval() {
        clearInterval(this.$_loadingTimeInterval)
        this.$_loadingTimeInterval = null
      },
      startLoading() {
        this.loading = true
        this.loadingTime = 0
      },
         escuchar(){
            const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({text:this.newText})};
            fetch("https://j482e2w6lb.execute-api.us-east-2.amazonaws.com/development/dictate", requestOptions)
            .then(response => response.json())
            .then(data=>{
            //console.log(data)
            this.audiosrc = data
            })
        },
        traducir(){
            const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({titulo:this.titulo,texto:this.texto,idioma:this.selected})};
            fetch("https://j482e2w6lb.execute-api.us-east-2.amazonaws.com/development/translate", requestOptions)
            .then(response => response.json())
            .then(data=>{
            //console.log(data)
            this.translatedtitle = data.titulo.TranslatedText
            this.translatedtext = data.texto.TranslatedText
            })
            this.view = false
            this.selected = null
        },
        eliminar(){
            const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: localStorage.getItem('username'),numero:this.num,proyecto:this.$store.getters.getName})};
            fetch("https://j482e2w6lb.execute-api.us-east-2.amazonaws.com/development/deleteresource", requestOptions)
            .then(response => response.json())
            .then(data=>{
            console.log(data)
            this.$root.$emit('eliminar')
            })
        },
        guardar(){
            const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: localStorage.getItem('username'),numero:this.num,color:this.color,nombre:"",src:"",texto:this.newText,tipo:'Nota',titulo:this.newTitle,proyecto:this.$store.getters.getName})};
            fetch("https://j482e2w6lb.execute-api.us-east-2.amazonaws.com/development/addresource", requestOptions)
            .then(response => response.json())
            .then(data=>{
            console.log(data)
            })
        }
    }
}
</script>

<style>
.tipo{
 margin: 2%;
 border-radius: 15px;
 border-color: black;
 border-width: 5px;
}
.titulo{
  background-color: transparent;
  background-repeat:no-repeat;
  border: none;
  cursor:pointer;
  overflow: hidden;
  outline:none;
  
}
</style>