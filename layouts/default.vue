<template>
  <div>
    <b-navbar type="is-dark" spaced shadow class="has-text-weight-bold">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img
            src="https://res.cloudinary.com/dalisapxa/image/upload/v1633344935/school/cover_a69noc.png"
            alt="Lightweight UI components for Vue.js based on Bulma"
          />
        </b-navbar-item>
      </template>
      <template #start>
        <b-navbar-item tag="nuxt-link" to="/" exact-active-class="is-active"> Home </b-navbar-item>

        <!--        <client-only >-->
        <b-navbar-item
          v-if="user.role === 'PARENT'"
          tag="nuxt-link"
          to="/parent/addChildAccount"
          exact-active-class="is-active"
        >
          Add
        </b-navbar-item>
        <b-navbar-item
          v-if="user.role === 'TEACHER'"
          tag="nuxt-link"
          to="/course/add-courses"
          exact-active-class="is-active"
        >
          Courses
        </b-navbar-item>
        <b-navbar-item
          v-if="user"
          tag="nuxt-link"
          to="/course/find_courses"
          exact-active-class="is-active"
        >
          find courses
        </b-navbar-item>
        <!--        </client-only>-->
        <b-navbar-dropdown
          v-if="user.role === 'TEACHER'"
          has-link
          class="has-text-weight-bold"
          label="add"
          icon="book"
          type="is-warning"
          arrowless
          collapsible
        >
          <b-navbar-item tag="nuxt-link" to="/course/add-courses" exact-active-class="is-active">
            courses
          </b-navbar-item>
          <b-navbar-item href="#"> Contact </b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <template #end>
        <b-navbar-item tag="div">
          <div v-if="authenticated" class="buttons">
            <b-button type="is-primary" tag="nuxt-link" to="/"> {{ user.role }}</b-button>
            <b-button type="is-light" class="has-text-weight-bold" @click="logout"
              >Log out</b-button
            >
          </div>

          <div v-else class="buttons">
            <b-button type="is-primary" tag="nuxt-link" to="/login"> login</b-button>
            <b-button type="is-light" tag="nuxt-link" to="/signup" class="has-text-weight-bold"
              >Sign up</b-button
            >
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <section>
      <div class="container column is-10 is-fluid">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  computed: {
    authenticated() {
      try {
        return this.$store.state.auth.loggedIn
      } catch (error) {
        return ''
      }
    },
    user() {
      try {
        if (this.$store.state.auth.user === undefined || this.$store.state.auth.user === null) {
          return 'null'
        }
        return this.$store.state.auth.user
      } catch (error) {
        return error
      }
    },
  },
  methods: {
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
