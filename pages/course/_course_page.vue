<template>
  <div>
    <section class="container">
      <div class="columns is-centered is-multiline mt-5">
        <div class="column is-8-tablet has-text-light">
          <div class="box">
            <p class="title ml-4 has-text-centered">{{ course.name }}</p>
            <p class="is-size-3 ml-4">{{ course.description }}</p>
          </div>
        </div>
        <div v-if="course.teacher" class="column is-4 is-half-mobile">
          <div class="has-background-warning box">
            <p class="is-size-5">
              taught by:
              <span class="is-size-4">
                prof {{ course.teacher.first_name + ' ' + course.teacher.last_name }}
              </span>
            </p>
            <p>
              contact email:
              <a :href="'mailto:' + course.teacher.email">{{ course.teacher.email }}</a>
            </p>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="course.registered_students && course.registered_students.length"
      class="mt-4 pt-3"
    >
      <p class="title">list of registered students</p>

      <b-table
        :data="course.registered_students"
        :columns="[
          { field: 'email', label: 'Email' },
          { field: 'first_name', label: 'first name' },
          { field: 'last_name', label: 'last name' },
        ]"
        s
      ></b-table>
    </section>

    <section v-if="course.course_in_timetable">
      <h1 class="title mb-2 mt-3 pt-3">course dates</h1>

      <div class="columns is-centered is-multiline">
        <div
          v-for="(date, index) in course.course_in_timetable"
          :key="index"
          class="column is-narrow is-one-third-desktop is-half-tablet mt-2 pt-3"
        >
          <div class="box has-text-centered">
            <p class="is-size-4">{{ date.weekday }}</p>

            <p class="is-size-3">{{ date.course_time }}</p>

            <b-button
              v-if="$store.state.auth.user && course.teacher_id === $store.state.auth.user.id"
              rounded
              type="is-danger is-light"
              @click="confirmDelete(date.id, index)"
            >
              delete
            </b-button>
          </div>
        </div>
      </div>
    </section>
    <section v-if="course.sessions" class="mb-4">
      <div class="columns is-centered is-multiline">
        <div v-for="(session, index) in course.sessions" :key="index">
          <div class="column is-narrow">
            <div class="box has-text-centered has-background-warning">
              <b-tag
                v-if="new Date(session.session_date) > Date.now()"
                close-icon="check-outline"
                type="is-primary"
                class="has-text-weight-bold"
              >
                upcoming
                <b-icon icon="clock-outline" size="is-small"> </b-icon>
              </b-tag>

              <b-tag v-else class="has-text-weight-bold" type="is-success is-light">
                finished

                <b-icon icon="check-outline" size="is-small"> </b-icon>
              </b-tag>

              <p class="is-size-3">
                {{
                  new Date(session.session_date).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                }}
              </p>
              <p class="is-size-3">
                {{
                  new Date(session.session_date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }}
              </p>

              <b-button
                v-if="$store.state.auth.user && course.teacher_id === $store.state.auth.user.id"
                rounded
                type="is-danger"
                @click="confirmDeleteSession(session.session_id, index)"
              >
                delete
              </b-button>
              <b-button
                tag="router-link"
                :to="`/session/${session.session_id}`"
                rounded
                type="is-primary"
              >
                see more
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="$store.state.auth.user && course.teacher_id === $store.state.auth.user.id">
      <div class="columns is-centered is-vcentered">
        <div class="column is-narrow is-half mt-2 pt-3">
          <add-session-to-course :course="course" :code="course.code"></add-session-to-course>
        </div>
      </div>
    </section>
  </div>
</template>




<script>
import SignupAsParent from '../signupAsParent'
import addSessionToCourse from '../../components/addSessionToCourse'

export default {
  components: { addSessionToCourse },
  data() {
    return {
      isOpen: null,
      isOpen2: null,
      courses: [{}],
      counter: 0,

      course: {
        code: '',
        name: '',
        description: '',
      },
    }
  },
  head() {
    return {
      title: this.course.name,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: this.course.description,
        },
      ],
    }
  },
  async mounted() {
    await this.findCourse()
  },

  methods: {
    async findCourse() {
      try {
        const data = await this.$axios.$get(`/course/${this.$route.params.course_page}`)
        // console.log("hey" + data)
        // console.log(this.search)
        this.course = data
      } catch (err) {
        console.log(err)
        this.$buefy.toast.open(err)
      }
    },

    async removeDate(date_id, index) {
      try {
        const data = await this.$axios.$delete(`/course/date_in_table/${date_id}`)
        this.course.course_in_timetable.splice(index, 1)
      } catch (err) {
        console.log(err)
        this.$buefy.toast.open(err.message)
      }
    },
    async removeSession(session_id, index) {
      try {
        const data = await this.$axios.$delete(`/session/${session_id}`)
        console.log(this.course)
        this.course.sessions.splice(index, 1)
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
  },
}
</script>
