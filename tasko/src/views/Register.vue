<template>
  <div id="wrapper">

    <b-card v-if="showConfirmation" class="card">
      <h1>Almost done! ⌛</h1>
      <p>Check your email for the confirmation code.</p>
      
        <input id="input1" v-model="confirmation" type="text" placeholder="Confirmation Code" required>
        <p></p>
        <input v-if="lateUsername" id="input2" v-model="form.username" type="text" placeholder="Username">
      
      <p><b-button style="margin: 10px;" variant="success" @click="confirmar()">Confirm!</b-button></p>
    </b-card>


      <b-card v-if="!showConfirmation" class="card">
        <b-img src="https://semi1finalrecursos.s3.us-east-2.amazonaws.com/blacklogo.png" fluid alt="Responsive image"></b-img>
        <h1>Sign up 🎉</h1>
<b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <div class="container">
              <b-row>
                <b-col>
                  <b-form-group id="input-group-3" label="✉ Your E-mail: " label-for="input-1">
                    <b-form-input id="input-3" v-model="form.email" type="email" placeholder="Enter your email" required></b-form-input>
                  </b-form-group>

                        <b-form-group id="input-group-1" label="👤 Your Username: " label-for="input-1">
                            <b-form-input id="input-1" v-model="form.username" type="text" placeholder="Enter your username" required></b-form-input>
                        </b-form-group>

                        <b-form-group id="input-group-2" label="🔑 Your Password: " label-for="input-2">
                            <b-form-input :state="validation" id="input-2" v-model="form.password" type="password" placeholder="Enter your password" required></b-form-input>
                            <b-form-invalid-feedback :state="validation">
                              Your password must be 8 or more characters long, containt uppercases and a symbol 
                            </b-form-invalid-feedback>
                            <b-form-valid-feedback :state="validation">
                              Looks Good.
                            </b-form-valid-feedback>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group id="input-group-5" label="💬 Your Name: " label-for="input-5">
                            <b-form-input id="input-5" v-model="form.name" type="text" placeholder="Enter your name" required></b-form-input>
                        </b-form-group>

                        <b-form-group id="input-group-4" label="📅 Your Birthdate: " label-for="datepicker">
                            <b-form-datepicker id="datepicker" :date-format-options="{day: 'numeric', month: 'numeric', year: 'numeric'}" locale="en" v-model="form.date" class="mb-2"></b-form-datepicker>
                        </b-form-group>

                        <b-form-group id="input-group-6" label="📷 Your Profile picture: " label-for="input 6">        
                          <input type="file" @change="handleImage" id="input-6" accept="image/*" :state="Boolean(image)" placeholder="Choose an image" drop-placeholder="Drop image here">
                        </b-form-group>
                    </b-col>
                </b-row>
            </div>
            <b-button type="submit" variant="dark">Sign Up</b-button>
            <!--<b-button @click="onSubmit()" variant="dark">Sign Up</b-button>-->
</b-form>
            <p><router-link to="/login">Alredy registered? Log in</router-link></p>
            <p @click="confirmarDespues()">Confirm my code</p>
      </b-card>

  </div>
</template>

<script>

export default {
data() {
      return {
        lateUsername: false,
        showConfirmation: false,
        confirmation:'',
        form:{
          email: '',
          username: '',
          name:'',
          password: '',
          date: ''
        },
        image: '',
        show: true
      }
    },
    computed:{
      validation(){
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return regex.test(this.form.password)
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
      confirmarDespues(){
        this.showConfirmation = true
        this.lateUsername = true;
      },
      confirmar(){
        var username = ''
        if(this.lateUsername){
          username = this.form.username
        }else{
          username = localStorage.getItem('username')
        }
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username:username,code:this.confirmation})
        }
        fetch("https://j482e2w6lb.execute-api.us-east-2.amazonaws.com/development/confirmemail",requestOptions)
        .then(async response =>{
          const data = await response.json();
          if(!response.ok){
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          console.log(data)
          if(data.errorMessage){
            this.makeToast('danger','Error','No se pudo verificar el codigo, intenta de nuevo 🙁')
          }else{
            this.makeToast('success','Welcome','Gracias por verificar tu usuario, bienvenido a Tasko 📝')
            this.$router.push('/login');
          }
        })
        .catch(error=>{
          console.log(error)
        })
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
      onSubmit(event) {
        event.preventDefault()
        let mes = this.form.date.slice(5,7)
        let year = this.form.date.slice(0,4)
        let day = this.form.date.slice(8,10)
        let fecha = day+'/'+mes+'/'+year

        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({picture:this.image, birthdate:fecha, email:this.form.email, name:this.form.name, username:this.form.username, password: this.form.password})
        }
        fetch("https://j482e2w6lb.execute-api.us-east-2.amazonaws.com/development/register",requestOptions)
        .then(async response =>{
          const data = await response.json();
          if(!response.ok){
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          if(data.errorMessage){
            this.makeToast('danger','Error','Hubo un problema al registrar tu usuario 😔')
            this.onReset()
          }else{
            this.makeToast('success','Welcome','Tu usuario ha sido registrado, revisa tu correo para obtener el codigo de verificacion! ✨')
            this.showConfirmation = true;
            localStorage.setItem('username',this.form.username)
            this.onReset()
          }
        })
        .catch(error=>{
          console.log(error)
        })

      },
      onReset() {
        this.form.username = ''
        this.form.password = ''
        this.form.email = ''
        this.form.date = ''
        this.form.name = ''
        this.form.image = ''
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
}
</script>

<style>
.card{
    max-width: 50%;
    max-height: 15%;
    margin-left: 27%;
    text-align: center;
    margin-bottom: 150px;
}

</style>