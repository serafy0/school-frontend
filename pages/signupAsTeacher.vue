<template>
  <section>



    <div class="container is-centered is-fluid">

      <div class="columns  is-centered   ">
        <div class="column is-two-fifths is-small">

          <div class="box has-background-dark   is-small hero" >
            <div class='container has-text-centered'>
              <!--            <div class="title has-text-light"> login</div>-->
            </div>


            <form
              @submit.prevent="signUp"


            >
              <b-field  label='name' custom-class='has-text-light' expanded>
                <b-input type='text'
                         icon='book'
                         label='first name'
                         required
                         v-model='form.first_name'
                         placeholder="first name"
                         expanded
                ></b-input>
                <b-input type='text'
                         icon='book'
                         placeholder="last name"
                         v-model='form.last_name'
                         expanded

                         required

                ></b-input>

              </b-field>
              <b-field label="Email"
                       custom-class='has-text-light'

              >
                <b-input type="email"
                         icon="email"
                         v-model="form.email"
                         required
                >
                </b-input>
              </b-field>


              <b-field label="Password"
                       custom-class='has-text-light'

              >
                <b-input type="password"
                         icon="key"
                         v-model="form.password"
                         required
                         password-reveal>
                </b-input>
              </b-field>

              <b-field postion="centered" class='has-text-centered'><!-- Label left empty for spacing -->
                <b-button
                  type='is-dark'


                  size='is-large'
                  inverted
                  outlined

                  native-type='submit'
                > <strong>Sign Up</strong></b-button>

                <!--                  <b-button type="is-primary" inverted outlined>Inverted</b-button>-->
              </b-field>

            </form>

          </div>


          <!--          <b-button @click='logout'>-->
          <!--            logout-->
          <!--          </b-button>-->






        </div>
      </div>
    </div>

  </section>

</template>

<script>
import Inspire from "./inspire";

export default {
  components: { Inspire },
  data() {
    return {
      posts: {},
      errors: [],
      result: null,
      form: {
        first_name:"",
        last_name:"",
        email: "",
        password: ""
      }
    }
  },

  methods:{
    async signUp(){
      this.$axios.$post("/teacher/signup",
        {
          first_name: this.form.first_name ,
          last_name:this.form.last_name,
          email:(this.form.email).toLowerCase(),
          password:this.form.password
        }

      ).then(res=>{
          this.$buefy.toast.open(`you just signed up, welcome ${this.form.
            first_name} !`)
          this.sendLogin()

        }
      ).catch (e=>{
        // if(!e.status){
        //   this.$buefy.snackbar.open("network error")
        //
        // }else {
        this.$buefy.snackbar.open(e.response.data)
      });

    },
    async sendLogin(){
      try{
        await this.$auth.loginWith('local', {
            data: {
              email: (this.form.email).toLowerCase(),
              password: this.form.password,

            }
          }

        )
        this.$buefy.toast.open("you just logged in !")


      }
      catch (e){
        this.$buefy.toast.open(e)
        console.log(e)
      }

      // this.$toast.info()
      // await this.$auth.fetchUser()



      // } catch (e) {
      // // do something on failure
      //
      // }

    },
    async logout(){
      try {
        await this.$auth.logout()
        this.$buefy.toast.open("logged out")
      }catch (e){
        this.$toast.error(e)
      }
      await this.$router.push('/')


    },






  }
}

</script>
