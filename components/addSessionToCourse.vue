<template>

  <div class='box'>
    <form
      @submit.prevent="addSession(code,session_date)">







      <b-field label="time">
<!--        <b-timepicker v-model='session_date'></b-timepicker>-->
        <b-datetimepicker position='is-top-right' v-model="session_date"></b-datetimepicker>

      </b-field>

      <b-field postion="centered" class='has-text-centered'><!-- Label left empty for spacing -->
        <b-button
          type='is-primary'


          size='is-large'

          outlined

          native-type='submit'
        > <strong> add date </strong></b-button>

        <!--                  <b-button type="is-primary" inverted outlined>Inverted</b-button>-->
      </b-field>




    </form>
  </div>
</template>

<script>
import Inspire from '../pages/inspire'
export default {
  components: { Inspire },

  props: {

    code: String,
    course:Object

  },

  data() {
    return {
      session_date:null

    }
  },
      methods: {
      async addSession(course_id, date)
      {

        try {
          const data = await this.$axios.$post(`/session`, {course_code:course_id,session_date:date});
          console.log(data)
          this.course.sessions.push(data)


          this.$buefy.toast.open(`new session created`)

        } catch (err) {
          if (err.response) {
          this.$buefy.snackbar.open({
            indefinite: true
            , message: err.response.data.message
          })
          console.log(err.response.data.message)
        }

          this.$buefy.snackbar.open({
            indefinite: true
            , message: err
          })



        }

      }
    ,

  }
}

</script>
