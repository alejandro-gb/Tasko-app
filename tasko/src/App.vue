<template>
  <div id="app">
    <div>
      <b-button v-b-toggle.sidebar-1 variant="white"><b-icon icon="journal-plus" font-scale="3"></b-icon></b-button>
      <b-sidebar bg-variant="dark" text-variant="light" id="sidebar-1" shadow>
        <div class="px-3 py-2">
          <b-img src="https://semi1finalrecursos.s3.us-east-2.amazonaws.com/whitelogo.png" fluid></b-img>
          <h4><router-link v-if="!isLogged" to="/">Home</router-link></h4>
          <h4><router-link v-if="!isLogged" to="/login">Login</router-link></h4>
          <h4><router-link v-if="!isLogged" to="/signup">Sign up</router-link></h4>
          <div v-if="isLogged">
            <h2>My projects 📝</h2>
            <div v-for="proyecto in proyectos" :key="proyecto.proyecto" >
              <button class="custom" @click="verProyecto(proyecto.proyecto)">{{proyecto.proyecto}}</button>
            </div>
            <p><input class="custom" v-model="newName" placeholder="New" type="text"></p>
            <b-button style="margin-left: 50px; margin-top:50px;" variant="info" @click="postProject()">+ New</b-button>
          </div>
          <b-button style="margin-left: 50px; margin-top:50px;" v-if="isLogged" @click="logout()" variant="danger">Log out</b-button>
        </div>
      </b-sidebar>
    </div>
    <router-view />
  </div>
</template>

<script>
export default{
  data(){
    return{
      variable:false,
      newName: '',
      isLogged: this.checkIfIsLogged(),
      proyectos:[]
    }
  },
  mounted(){
      this.getprojects()
  },
  methods:{
    postProject(){
      const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username: localStorage.getItem('username'),project: this.newName})};
                fetch("https://j482e2w6lb.execute-api.us-east-2.amazonaws.com/development/createproject", requestOptions)
                .then(response => response.json())
                .then(data=>{
                console.log(data)
                this.proyectos.length = 0
                this.getprojects()
                this.newName = ''
          })
    },
    async getprojects(){
      const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username: localStorage.getItem('username')})};
        await fetch("https://j482e2w6lb.execute-api.us-east-2.amazonaws.com/development/getprojects", requestOptions)
        .then(response => response.json())
        .then(data=>{
        for (let index = 0; index < data.length; index++) {
            this.proyectos.push({proyecto:data[index].project.S});
        }
    })
    },
    verProyecto(nombre){
      this.$store.commit('change',nombre)
      this.$bus.$emit('change')
    },
    logout:function(){
      localStorage.removeItem('sesion')
      localStorage.removeItem('name')
      localStorage.removeItem('username')
      localStorage.removeItem('profilepic')
      localStorage.removeItem('email')
      this.isLogged = this.checkIfIsLogged()
      this.$router.push('/')
    },

    checkIfIsLogged:function(){
      this.variable = localStorage.getItem('sesion')
      if(this.variable){
        return true
      }else{
        return false
      }
    },
    created(){
      this.$bus.$on('logged',()=>{
        this.isLogged = this.checkIfIsLogged()
      })
    }


  }
}
</script>


<style>

@import url('https://fonts.googleapis.com/css2?family=Antonio:wght@100&family=Fjalla+One&display=swap');

.custom{
  background-color: transparent;
  background-repeat:no-repeat;
  border: none;
  cursor:pointer;
  overflow: hidden;
  outline:none;
  color: white;
  width: 10rem;
  height: 3rem;
}

#app {
  display: flex;
  flex-direction: column;
  font-family: 'Fjalla One', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
}
</style>
