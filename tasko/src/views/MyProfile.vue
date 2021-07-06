<template>
  <div class="Myprofile">
      <h1>👋🏼 Welcome  {{username}}<b-avatar style="margin-left: 25%;" variant="dark" size="6rem" :src="imagen"></b-avatar>
      <b-button v-b-modal.modal-1 variant="success" style="margin-left: 25%;"> New ✍🏼</b-button>
      </h1>
      <hr>
      <h1>{{project}}</h1>
      <div v-for="elemento in elementos" :key="elemento.numero">
        <Tipo v-if="elemento.tipo == 'Nota'" :titulo="elemento.titulo" :texto="elemento.texto" :color="elemento.color" :num="elemento.numero"/>
        <TipoImagen v-if="elemento.tipo == 'Imagen'" :titulo="elemento.titulo" :dir="'https://semi-proyecto-g9.s3.us-east-2.amazonaws.com/'" :src="elemento.src" :num="elemento.numero"/>
      </div>

        <b-modal id="modal-1" title="Opciones">
            <b-form-select v-model="selected" :options="options"></b-form-select>
            <div v-if="selected == 'Note'">
                <hr>
                <colour-picker v-model="colour" :value="colour" label="Choose the colour of the note" no-input picker="sketch" />
            </div>
            <div v-if="selected == 'Image'">
                <hr>
                <b-form-group id="input-group-5" label="📌Title" label-for="input-5">
                            <b-form-input id="input-5" v-model="imageTitle" type="text" placeholder="Title of the image" required></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-6" label="📷 Your Image: " label-for="input 6">        
                    <input type="file" @change="handleImage" id="input-6" accept="image/*" :state="Boolean(image)" placeholder="Choose an image" drop-placeholder="Drop image here">
                </b-form-group>
            </div>
            <div v-if="selected == 'Audio'">
                <audio-recorder
    upload-url="YOUR_API_URL"
    :attempts="3"
    :time="2"
    :headers="headers"
    :before-recording="callback"
    :pause-recording="callback"
    :after-recording="callback"
    :select-record="callback"
    :before-upload="callback"
    :successful-upload="callback"
    :failed-upload="callback"/>
     <audio-player src="/demo/example.mp3"/>
            </div>
        </b-modal>

  </div>
</template>

<script>
import Tipo from "@/components/tipo.vue"
import TipoImagen from "@/components/tipoImagen.vue"
import  ColourPicker  from 'vue-colour-picker'
export default {
    components:{
        Tipo,
        TipoImagen,
        'colour-picker': ColourPicker,
    },
    data(){
        return{
        imageTitle : '',
        image: '',
        colour: '#000000',
        selected: null,
        options: [
          { value: null, text: 'Please select an option' },
          { value: 'Note', text: 'New Note' },
          { value: 'Image', text: 'New image' },
          { value: 'Audio', text: 'Upload audio' },
          { value: 'File', text: 'Upload file' },
        ],
        username:'',
        project:'',
        imagen: 'https://semi-proyecto-g9.s3.us-east-2.amazonaws.com/'+localStorage.getItem('profilepic'),
        elementos:[
            /*{numero:1,tipo:'Nota',color:'#ffda73',titulo:'titulo1',texto:'Contenido de la nota'},
            {numero:2,tipo:'Nota',color:'#deff73',titulo:'titulo2',texto:'Contenido de la nota 2'},
            {numero:3,tipo:'Imagen',titulo:'Imagen 1',src:'https://picsum.photos/720/720'},
            {numero:4,tipo:'Nota',color:'#ffde73',titulo:'titulo1',texto:'Contenido de la nota'},
            {numero:5,tipo:'Imagen',titulo:'Imagen 2',src:'https://picsum.photos/720/720'},
            {numero:6,tipo:'Imagen',titulo:'Imagen 3',src:'https://picsum.photos/720/720'},
            {numero:7,tipo:'Audio',nombre:'Audio1',src:'Direccion del audio'}*/
        ]
        }
    },
    methods:{
        callback (data) {
        console.debug(data)
      },
        handleImage(e){
        const selectedImage = e.target.files[0];
        this.createBase64Image(selectedImage);
      },
      createBase64Image(fileObject){
        const reader = new FileReader();
        reader.onload = (e)=>{
          this.image = e.target.result;
        };
        reader.readAsDataURL(fileObject);
      },
      actualizar(){
        this.elementos.length = 0
        const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username: localStorage.getItem('username'),proyecto: this.project})};
                fetch("https://j482e2w6lb.execute-api.us-east-2.amazonaws.com/development/getresources", requestOptions)
                .then(response => response.json())
                .then(data=>{
                for (let index = 0; index < data.length; index++) {
                    this.elementos.push({numero:parseInt(data[index].numero.N),tipo:data[index].tipo.S,color:data[index].color.S,titulo:data[index].titulo.S,texto:data[index].texto.S,nombre:data[index].nombre.S,src:data[index].src.S});
                    
                }
          })
      }
    },
    mounted() {
    this.$bus.$on('change',()=>{
            this.actualizar()
          //console.log(this.elementos)
    })
    this.$root.$on('eliminar',()=>{
        this.actualizar()
    })
    this.$root.$on('bv::modal::hide', (bvEvent) => {
        if(bvEvent.trigger == 'ok' ){
            if(this.selected == 'Note'){
                let num = this.elementos.length + 2
                let nota = {numero: num,tipo:'Nota',color:this.colour,titulo:'Edit the title',texto:'Edit the content of the note'}
                this.elementos.push(nota)
            }else if(this.selected == 'Image'){
                let num = this.elementos.length + 2
                const requestOptions = {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({username: localStorage.getItem('username'),numero:num,color:"",nombre:"",src:this.image,texto:"",tipo:'Imagen',titulo:this.imageTitle,proyecto:this.$store.getters.getName})};
                    fetch("https://j482e2w6lb.execute-api.us-east-2.amazonaws.com/development/addresource", requestOptions)
                    .then(response => response.json())
                    .then(data=>{
                    console.log(data)
                    this.$bus.$emit('change')
                    })
                
            }
        }
    })
    },
    created(){
        this.username = localStorage.getItem('username')
        this.$bus.$on('change',()=>{
        this.project = this.$store.getters.getName
      })
    }

}
</script>

<style>
 
.Myprofile{
    margin-left: 17%;
}
</style>