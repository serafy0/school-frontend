<template>
  <section>
    <div class="container is-centered is-fluid">
      <div class="columns is-centered">
        <div class="column is-two-fifths is-small">
          <div class="box has-background-dark is-small hero">
            <div class="container has-text-centered">
              <!--            <div class="title has-text-light"> login</div>-->
            </div>

            <form @submit.prevent="signUp">
              <b-field label="name" custom-class="has-text-light" expanded>
                <b-input
                  v-model="form.first_name"
                  type="text"
                  label="first name"
                  required
                  placeholder="first name"
                ></b-input>
                <b-input
                  v-model="form.last_name"
                  type="text"
                  placeholder="last name"
                  required
                ></b-input>
              </b-field>
              <b-field label="Email" custom-class="has-text-light">
                <b-input v-model="form.email" type="email" icon="email" required> </b-input>
              </b-field>

              <b-field label="Password" custom-class="has-text-light">
                <b-input
                  v-model="form.password"
                  type="password"
                  icon="key"
                  required
                  password-reveal
                >
                </b-input>
              </b-field>

              <b-field postion="centered" class="has-text-centered"
                ><!-- Label left empty for spacing -->
                <b-button type="is-dark" size="is-large" inverted outlined native-type="submit">
                  <strong>Sign Up</strong></b-button
                >
              </b-field>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      posts: {},
      errors: [],
      result: null,
      form: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
      },
    }
  },

  methods: {
    async signUp() {
      try {
        console.log(this.form.email)
        await this.$axios.$post('/signup', {
          first_name: this.form.first_name,
          last_name: this.form.last_name,
          email: this.form.email.toLowerCase(),
          password: this.form.password,
        })
        // .then(res=>{
        this.$buefy.toast.open(`you just signed up, welcome ${this.form.first_name} !`)
        await this.sendLogin()
        console.log(this.form.email + 'worked')
      } catch (e) {
        console.log(e.response.data)
        this.$buefy.snackbar.open(e.response.data)
        console.log(this.form.email + 'error')
      }
    },
    async sendLogin() {
      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.form.email.toLowerCase(),
            password: this.form.password,
          },
        })
        this.$buefy.toast.open('you just logged in !')
      } catch (e) {
        if (!e.response) {
          this.$buefy.snackbar.open('network error, please try again later')
        } else {
          this.$buefy.snackbar.open(e.response.data)
        }
      }
    },
    async logout() {
      try {
        await this.$auth.logout()
        this.$buefy.toast.open('logged out')
      } catch (e) {
        this.$toast.error(e)
      }
      await this.$router.push('/')
    },
  },
}
</script>
