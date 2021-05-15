<template>
  <section>



    <div class="container is-centered is-fluid">

      <div class="columns  is-centered   ">
        <div class="column is-two-fifths  ">

          <div class="box has-background-primary  hero" >
            <div class='container has-text-centered'>
<!--            <div class="title has-text-light"> login</div>-->
            </div>


            <form
              @submit.prevent="sendLogin"


            >
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
                            inverted
                            outlined
                            size='is-large'
                            native-type='submit'
                            class='has-text-weight-bold'
                         > Login</b-button>

<!--                  <b-button type="is-primary" inverted outlined>Inverted</b-button>-->
             </b-field>

            </form>

          </div>







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
        email: "",
        password: ""
      }
    }
  },

  methods:{
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
        if(!e.response){
          this.$buefy.snackbar.open("network error, please try again later")

        }else {
          this.$buefy.snackbar.open(e.response.data)
        }

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
