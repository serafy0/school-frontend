<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <p class="title">session {{ session.session_number }}</p>

        <p class="subtitle">{{ session.course.name }}</p>
      </div>
    </section>
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
      :opened-detailed="opened_items"
      detail-key="id"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      @click="clickOnItem($event)"
    >
      <template #detail="props">
        <div class="m-2 p-2 columns is-multiline">
          <div v-for="feedback in props.row.feedbacks" :key="feedback.id" class="column">
            <div class="card m-2">
              <header classs="card-header">
                <div class="card-header-title">
                  <b-rate v-model="feedback.rating" disabled> </b-rate>
                </div>
              </header>
              <div class="card-content">
                {{ feedback.feedback_text }}
              </div>
              <footer v-if="$store.state.auth.user.id === feedback.written_by" class="card-footer">
                <a
                  class="card-footer-item"
                  @click="confirmDelete(feedback.id, 'feedback', props.row.id)"
                  >Delete</a
                >
              </footer>
            </div>
          </div>
        </div>
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
      opened_items: [],
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
    clickOnItem(e) {
      if (this.opened_items.includes(e.id)) {
        this.opened_items = this.opened_items.filter((item) => item !== e.id)
        return
      }
      this.opened_items.push(e.id)
    },

    async removeItem(id, type, owner_id) {
      try {
        const data = await this.$axios.$delete(`/${type}/${id}`)
        if (type === 'feedback') {
          this.session.course.registered_students.forEach((student) => {
            if (student.id == owner_id) {
              student.feedbacks = student.feedbacks.filter((feedback) => feedback.id != id)
            }
          })
        }
        if (type === 'session') {
          const course_code = this.session.course.code
          this.$router.push(`/course/${course_code}`)
        }
      } catch (err) {
        console.log(err)
        this.$buefy.toast.open(err.message)
      }
    },
    confirmDelete(id, type, owner_id) {
      this.$buefy.dialog.confirm({
        message: `Are you sure you want to delete this ${type}`,
        type: 'is-danger is-light',
        confirmText: 'Yes, delete',
        onConfirm: () => this.removeItem(id, type, owner_id),
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
