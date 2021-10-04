<template>
  <section class="section">
    <div class="columns is-multiline">
      <card icon="github">
        see source code on
        <a target="_blank" href="https://github.com/serafy0/school-frontend"> GitHub </a>
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
