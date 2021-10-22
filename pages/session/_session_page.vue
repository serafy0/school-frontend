<template>
  <div>
    <div>
      {{ session }}
    </div>
    <div v-if="$store.state.auth.user.role === 'STUDENT'">
      <b-button @click="registerStudentToCourse(session.course.code)">register to course</b-button>
    </div>

    <b-table
      ref="table"
      :data="session.course.registered_students"
      :columns="[
        { field: 'email', label: 'Email' },
        { field: 'first_name', label: 'first name' },
        { field: 'last_name', label: 'last name' },
      ]"
      paginated
      per-page="5"
      detailed
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
    >
      detailed >
      <template #detail="props">
        <div>{{ props.row }}</div>
        <FeedbackFrom :student_id="props.row.id" :session="session" />
      </template>
    </b-table>
  </div>
</template>




<script>
import FeedbackFrom from '../../components/FeedbackFrom'
export default {
  //fetch all student and all feedbacks
  //add ability for teachers to give feedback
  //then for students to give feedback on the session
  components: { FeedbackFrom },
  data() {
    return {
      showDetailIcon: true,
      useTransition: false,
      isOpen: null,
      isOpen2: null,
      courses: [{}],
      counter: 0,
      session: {
        session_id: '',
        course_code: '',
        session_date: '',
        session_number: 0,
        course: {
          code: '',
          name: '',
          description: '',
          teacher_id: '',
          registered_students: '',
        },
      },
    }
  },
  head() {
    return {
      title: 'session',
    }
  },
  async mounted() {
    await this.findSession()
  },

  methods: {
    async findSession() {
      try {
        const data = await this.$axios.$get(`/session/students/${this.$route.params.session_page}`)
        console.log(data)
        this.session = data
      } catch (err) {
        console.log(err)
        this.$buefy.toast.open(err)
      }
    },

    async removeSession(session_id, index) {
      try {
        const data = await this.$axios.$delete(`/session/${session_id}`)
      } catch (err) {
        console.log(err)
        this.$buefy.toast.open(err.message)
      }
    },
    confirmDeleteSession(session_id, index) {
      this.$buefy.dialog.confirm({
        message: 'Are you sure you want to delete this date',
        type: 'is-danger is-light',
        confirmText: 'Yes, delete',
        onConfirm: () => this.removeSession(session_id, index),
      })
    },
    confirmDelete(date_id, index) {
      this.$buefy.dialog.confirm({
        message: 'Are you sure you want to delete this date',
        type: 'is-danger is-light',
        confirmText: 'Yes, delete',
        onConfirm: () => this.removeDate(date_id, index),
      })
    },

    async registerStudentToCourse(course_code) {
      try {
        const data = await this.$axios.$post(`/p/registerCourse/${course_code}`)
        this.$buefy.toast.open('you just registered to course')
      } catch (err) {
        if (err.response.status == 409) {
          this.$buefy.toast.open({
            message: 'you are alerady registerd for this course',
            type: 'is-danger',
          })
        } else {
          this.$buefy.toast.open(err.response.message)
          console.log(err)
        }
      }
    },
  },
}
</script>
