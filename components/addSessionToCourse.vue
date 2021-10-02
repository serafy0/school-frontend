<template>
  <div class="box">
    <form @submit.prevent="addSession(code, session_date)">
      <b-field label="time">
        <!--        <b-timepicker v-model='session_date'></b-timepicker>-->
        <b-datetimepicker v-model="session_date" position="is-top-right"></b-datetimepicker>
      </b-field>
      <b-field>
        <b-checkbox v-model="recurring"> repeated </b-checkbox>
      </b-field>

      <b-field v-if="recurring" label="number of repeats">
        <!--        <b-timepicker v-model='session_date'></b-timepicker>-->
        <b-input
          v-model="recurringNum"
          min="1"
          max="8"
          type="number"
          class="is-small"
          position="is-top-right"
        ></b-input>
      </b-field>

      <b-field postion="centered" class="has-text-centered"
        ><!-- Label left empty for spacing -->
        <b-button type="is-primary" size="is-large" outlined native-type="submit">
          <strong> add date </strong></b-button
        >

        <!--                  <b-button type="is-primary" inverted outlined>Inverted</b-button>-->
      </b-field>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    code: String,
    course: Object,
  },

  data() {
    return {
      session_date: null,
      recurringNum: 0,
      recurring: false,
    }
  },
  methods: {
    async addSession(course_id, date) {
      try {
        const promises = []
        for (let i = 0; i <= this.recurringNum; i++) {
          date.setDate(date.getDate() + i * 7)

          const data = await this.$axios.$post(`/session`, {
            course_code: course_id,
            session_date: date,
          })
          promises.push(data)
          console.log(data)
          this.course.sessions.push(data)
        }

        await Promise.all(promises)
        this.$buefy.toast.open(`new session created`)
      } catch (err) {
        if (err.response) {
          this.$buefy.snackbar.open({
            indefinite: true,
            message: err.response.data.message,
          })
          console.log(err.response.data.message)
        }

        this.$buefy.snackbar.open({
          indefinite: true,
          message: err,
        })
      }
    },
  },
}
</script>
