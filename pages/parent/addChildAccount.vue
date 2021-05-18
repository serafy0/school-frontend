<template>
  <div>
  <section v-if='authenticated&&user.role==="PARENT"' >


<div class='container is-centered is-fluid ' >
<!--  <b-message> {{related}}</b-message>-->

  <b-loading is-full-page v-model="loading" :can-cancel="true"></b-loading>


</div>
    <div class="container is-centered is-fluid" >

      <div class="columns  is-centered   ">
        <div class="column  is-small">


          <div class="box has-background-info-dark   is-small hero" >
            <h1 class='title has-text-warning'> add a related account account</h1>

            <div class='container has-text-centered'>
              <!--            <div class="title has-text-light"> login</div>-->
            </div>


            <form
              @submit.prevent="signUp"


            >
              <b-field  label='name' custom-class='has-text-light' expanded>
                <b-input type='text'
                         label='first name'
                         required
                         v-model='form.first_name'
                         placeholder="first name"
                         expanded
                ></b-input>
                <b-input type='text'
                         placeholder="last name"
                         v-model='form.last_name'


                         required
                         expanded

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
    <section class='pt-6' v-if='authenticated&&user.role==="PARENT"' >
      <div class='container'></div>
<!--      <h1 style='color: yellow;' class='title has-text-centered is-uppercase has-text-weight-bold'>your children</h1>-->
      <div class='box has-background-dark mb-0'>
      <h1 class='title has-text-warning has-text-centered '> your children</h1>
      </div>
      <div class="box has-background-light   is-small hero" >
        <b-table  :data="children"  :columns='[{field: "id",label:"ID"},{field: "first_name",label:"first name",},{field: "last_name",label:"last name",},{field: "email",label:"email",},]' paginated per-page='5' card-layout backend-sorting></b-table>
      </div>
    </section>

    <section v-else>
    <b-message  type="is-danger" >
      this section is reserved for parents
      maybe you need to <nuxt-link to='/login' class='has-text-info'>login</nuxt-link>
    </b-message>


  </section>


  </div>



</template>

<script>

export default {
  data() {
    return {
      posts: {},
      errors: [],
      result: null,
      children:[{}],
      loading:false,


      form: {
        first_name:"",
        last_name:"",
        email: "",
        password: ""
      }
    }
  },

  methods:{
    async fetchSomething() {
      try {
        const data = await this.$axios.$get('/p/related');
        this.children = data
        return data;
      }catch (err){
        this.$buefy.toast.open(err)
        // return


        }
      },

    async signUp(){

      this.loading=true

     await this.$axios.$post("/signup",
        {
          first_name: this.form.first_name ,
          last_name:this.form.last_name,
          email:(this.form.email).toLowerCase(),
          password:this.form.password
        }

      ).then(res=>{
          this.$buefy.toast.open(`you just added your child, say hi to  ${this.form.
            first_name} !`)
         this.fetchSomething()
          // this.sendLogin()

        }
      ).catch (e=>{
        // if(!e.status){
        //   this.$buefy.snackbar.open("network error")
        //
        // }else {
        this.$buefy.snackbar.open(e.response.data)
      });

      this.loading=false;


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






  },  computed: {



    authenticated () {
      try {
        return this.$store.state.auth.loggedIn
      } catch (error) {
        return ''
      }
    },
    user () {
      try {
        if ((this.$store.state.auth.user === undefined) || (this.$store.state.auth.user === null)) {
          return 'null'
        }
        return this.$store.state.auth.user
      } catch (error) {
        return error
      }
    },

    // async related(){
    //   let da={};
    //   let data= await this.$axios.$get('/p/related').then(res=> {da= res.data()})
    //   return da
    // }
  },

  async mounted() {
    const gettest = await this.fetchSomething()
  },


}

</script>
