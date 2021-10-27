<template>
  <section class="section">
    <div class="columns is-multiline">
      <card icon="github">
        see source code at
        <a target="_blank" href="https://github.com/serafy0/school-frontend"> GitHub </a>
      </card>
      <card v-if="!$auth.user" icon="account-tie">
        <NuxtLink to="/signupAsTeacher"> signup as a teacher </NuxtLink>
      </card>
      <card v-if="!$auth.user" icon="account-edit">
        <NuxtLink to="/signup"> signup as a student </NuxtLink>
      </card>
      <card v-if="!$auth.user" icon="account-supervisor-circle">
        <NuxtLink to="/signupAsParent"> signup as a parent </NuxtLink>
      </card>
    </div>
  </section>
</template>

<script>
import Card from '~/components/Card'

export default {
  name: 'HomePage',

  components: {
    Card,
  },
}
</script>
