<template>
  <div>

    <b-navbar type='is-dark' spaced shadow class="has-text-weight-bold">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img
            src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"

            alt="Lightweight UI components for Vue.js based on Bulma"
          >
        </b-navbar-item>
      </template>
      <template #start>
        <b-navbar-item tag="nuxt-link" to="/" exact-active-class="is-active">
          Home
        </b-navbar-item>


<!--        <client-only >-->
        <b-navbar-item tag="nuxt-link" to="/parent/addChildAccount" exact-active-class="is-active" v-if='user.role==="PARENT"'>
          Add
        </b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/course/add-courses" exact-active-class="is-active" v-if='user.role==="TEACHER"'>
          Courses
        </b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/course/find_courses" exact-active-class="is-active" v-if='user'>
          find courses
        </b-navbar-item>
<!--        </client-only>-->
        <b-navbar-dropdown has-link class="has-text-weight-bold" label="add" icon='book' v-if='user.role==="TEACHER"'type='is-warning' arrowless collapsible>
          <b-navbar-item  tag="nuxt-link" to="/course/add-courses" exact-active-class="is-active" >
             courses

          </b-navbar-item>
          <b-navbar-item href="#">
            Contact
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <template #end>
        <b-navbar-item tag="div">
            <div class="buttons" v-if='authenticated'>
              <b-button type='is-primary' tag="nuxt-link" to="/"> {{user.role}}</b-button>
              <b-button type='is-light' @click='logout' class='has-text-weight-bold'>Log out</b-button>
            </div>

            <div class="buttons" v-else>
              <b-button type='is-primary' tag="nuxt-link" to="/login"> login</b-button>
              <b-button type='is-light' tag="nuxt-link" to="/signup" class='has-text-weight-bold'>Sign up</b-button>
            </div>


        </b-navbar-item>
      </template>
    </b-navbar>
    <section  >
<!--      <aside class="column is-2 section">-->
<!--        <p class="menu-label is-hidden-touch">-->
<!--          General-->
<!--        </p>-->
<!--        <ul class="menu-list">-->
<!--          <li-->
<!--            v-for="(item, key) of items"-->
<!--            :key="key"-->
<!--          >-->
<!--            <nuxt-link-->
<!--              :to="item.to"-->
<!--              exact-active-class="is-active"-->
<!--            >-->
<!--              <b-icon :icon="item.icon" /> {{ item.title }}-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--          <li>-->

<!--            <nuxt-link :to="{name:'index'}"   exact-active-class="is-active"-->
<!--            >-->
<!--              <b-icon :icon="user" /> {{ this.authenticated }}-->


<!--            </nuxt-link>-->
<!--          </li>-->

<!--        </ul>-->
<!--      </aside>-->

      <div class="container column is-10 is-fluid">
        <br/>
        <p>user :{{user}}</p>
        <p>auth: {{authenticated}}</p>

        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  methods:{
    async logout(){
      try {
        await this.$auth.logout()
        this.$buefy.toast.open("logged out")
      }catch (e){
        this.$toast.error(e)
      }
      await this.$router.push('/')


    }
  },
  computed: {
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
    }
  },
}
</script>
