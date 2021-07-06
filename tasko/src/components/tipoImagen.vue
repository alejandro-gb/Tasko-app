<template>
    <div>
    <b-card no-body class="overflow-hidden" style="max-width: 50%;">
        <b-row no-gutters>
            <b-col md="8">
                <b-card-img :src="dir+src" alt="Image" class="rounded-0"></b-card-img>
            </b-col>
            <b-col md="3">
                <b-card-body :title="titulo">
                    <button class="titulo" @click="getText()">Get text👓</button>
                    <button class="titulo">❌</button>
                    <p>{{cadena}}</p>
                    <!--<button @click="guardar()" class="titulo">💾</button>-->
                </b-card-body>
            </b-col>
        </b-row>
    </b-card>
    </div>
</template>

<script>
export default {
    name:'TipoImagen',
    props:{
        titulo: String,
        src: String,
        num: Number,
        dir: String
    },
    data(){
        return{
            cadena:''
        }
    },
    methods:{

        getText(){
            const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({imagen:this.src})};
            fetch("https://j482e2w6lb.execute-api.us-east-2.amazonaws.com/development/extracttext", requestOptions)
            .then(response => response.json())
            .then(data=>{
            let tcadena = ''
            let count = 0
            for (let index = 0; index < data.length; index++) {
                
                if(data[index].includes(';')){
                    count++
                }
                if(count < 2){
                tcadena += data[index];
                }
            }
            this.cadena = tcadena
            })
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
.ccard{
    max-height: 550px;
    max-width: 550px;
}
</style>