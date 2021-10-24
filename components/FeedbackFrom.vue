<template>
  <div class="box">
    {{ student_id }}
    <form @submit.prevent="giveFeedBackToStudent">
      <b-field label="rating">
        <b-rate v-model="feedback.rating" required> </b-rate>
      </b-field>

      <b-field label="give a comment">
        <b-input v-model="feedback.feedback_text" type="textarea" required maxlength="255">
        </b-input>
      </b-field>

      <b-field postion="centered" class="has-text-centered"
        ><!-- Label left empty for spacing -->
        <b-button type="is-primary" size="is-large" outlined native-type="submit">
          <strong> edit </strong>
        </b-button>
      </b-field>
    </form>
  </div>
</template>


<script>
export default {
  props: {
    course: Object,
    session: Object,
    student_id: String,
  },
  data() {
    return {
      feedback: {
        feedback_text: '',
        rating: 0,
      },
    }
  },

  methods: {
    async giveFeedBackToStudent() {
      try {
        const data = await this.$axios.$post(`/feedback`, {
          feedback_text: this.feedback.feedback_text,
          rating: this.feedback.rating,
          session_id: this.session.session_id,
          student_id: this.student_id,
        })
        // this.children = data
        if (this.session) {
          this.session.course.registered_students.forEach((student) => {
            if (student.id === this.student_id) {
              student.feedbacks.push(data)
            }
          })
        }
        this.$buefy.toast.open(`session feedback given `)
      } catch (err) {
        this.$buefy.snackbar.open({ indefinite: true, message: err })

        // return
      }
    },
  },
}
</script>
