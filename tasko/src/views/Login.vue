<template>
    <div>
        <b-card class="imagen" title="Welcome back! 👋🏼" img-src="https://semi1finalrecursos.s3.us-east-2.amazonaws.com/imagen1.jpg" img-top>
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                
                <b-form-group id="input-group-1" label="👤 Your Username: " label-for="input-1">
                    <b-form-input id="input-1" v-model="form.username" type="text" placeholder="Enter your username" required></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-2" label="🔑 Your Password: " label-for="input-2">
                    <b-form-input id="input-2" v-model="form.password" type="password" placeholder="Enter your password" required></b-form-input>
                </b-form-group>
                
                <b-button type="submit" variant="primary">Log in</b-button>
      
            </b-form>
        </b-card>
    </div>
</template>

<script>
export default {
data() {
      return {
        form: {
          username: '',
          password: ''
        },
        show: true
      }
    },
    methods: {
      makeToast(variant = null,title,content){
        this.$bvToast.toast(content,{
          title: title,
          variant: variant,
          solid: true
        })
      },
      onSubmit(event) {
        event.preventDefault()
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username:this.form.username, password:this.form.password})
        }
        fetch("https://j482e2w6lb.execute-api.us-east-2.amazonaws.com/development/login",requestOptions)
        .then(async response =>{
          const data = await response.json();
          if(!response.ok){
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          if(data.errorMessage){
            this.makeToast('danger','Error','No se pudo iniciar sesion 😔')
            console.log(data)
          }else{
            this.makeToast('success','Welcome','Bienvenido de vuelta')
            localStorage.sesion = true
            localStorage.username = data.accessToken.payload.username;
            localStorage.name = data.idToken.payload.name;
            localStorage.email = data.idToken.payload.email;
            localStorage.profilepic = data.idToken.payload.picture;
            this.$bus.$emit('logged','User logged')
            this.$router.push('/myprofile');
          }
        })
        .catch(error=>{
          console.log(error)
        })
      },
      onReset(event) {
        event.preventDefault()
        this.form.username = ''
        this.form.password = ''
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
}
</script>

<style>
.imagen{
    max-width: 45%;
    max-height: 15%;
    margin-left: 25%;
    text-align: center;
}
</style>