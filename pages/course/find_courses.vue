<template>
  <div>
    <div class="columns is-centered">
      <b-field class="column is-half">
        <b-input
          v-model="search"
          has-icon-left
          icon="magnify"
          lazy="true"
          expanded
          rounded
          @input="searchForCourses"
        ></b-input>
      </b-field>
    </div>

    <div v-if="search !== ''" class="columns is-vcentered is-multiline">
      <div
        v-for="(course, index) in courses"
        ref="courses"
        :key="index"
        class="column is-narrow cardheader is-one-third-desktop is-half-tablet mt-2 pt-3"
      >
        <div class="card has-text-weight-bold">
          <header class="card-header has-background-grey-dark card-head">
            >
            <nuxt-link
              :to="'/course/' + course.code"
              class="card-header-title is-centered is-size-3 has-text-light size-large"
            >
              {{ course.name }}
            </nuxt-link>
          </header>

          <nuxt-link :to="'/course/' + course.code">
            <div class="card-content has-text-dark has-background-grey-light is-size-5">
              <div class="content" style="word-wrap: break-word">
                {{ course.description }}
              </div>
            </div>
          </nuxt-link>

          <b-collapse
            :open="isOpen == index"
            animation="slide"
            aria-id="contentIdForA11y1"
            @open="isOpen = index"
          >
            <ModalForm :is_open.sync="isOpen" :course="course"></ModalForm>
          </b-collapse>
          <b-collapse
            :open="isOpen2 == index"
            animation="slide"
            aria-id="contentIdForA11y12"
            @open=";(isOpen2 = index) && (isOpen = null)"
          >
            <edit-course-time :code="course.code"></edit-course-time>
          </b-collapse>

          <footer
            v-if="$store.state.auth.user && $store.state.auth.user.id === course.teacher_id"
            class="card-footer"
          >
            <a
              class="card-footer-item"
              aria-controls="contentIdForA11y12"
              @click="isOpen2 = clickCardButton(index, isOpen2)"
              >date</a
            >

            <a
              aria-controls="contentIdForA11y1"
              class="card-footer-item"
              icon-left="book"
              @click="isOpen = clickCardButton(index, isOpen)"
            >
              Edit</a
            >

            <a class="card-footer-item" @click="confirmDelete(index, course.code)">Delete</a>
          </footer>
          <footer v-else-if="$store.state.auth.user && $store.state.auth.user.role === 'STUDENT'">
            <a class="card-footer-item" @click="registerStudentToCourse(course.code)">register</a>
          </footer>
        </div>
      </div>
    </div>

    <div v-if="courses == ''">
      <b-message v-if="search === ''" has-icon type="is-info">
        type in something on the search bar
      </b-message>
      <b-message v-else has-icon type="is-info">
        looks like we didn't find anything that matches what you were looking for
      </b-message>
    </div>

    <div v-if="LoadingCourses">
      <b-loading v-model="LoadingCourses"> </b-loading>
    </div>
  </div>
</template>

<script>
import ModalForm from '../../components/ModalForm'

export default {
  components: { ModalForm },
  data() {
    return {
      isOpen: null,
      isOpen2: null,
      search: '',
      courses: [],
      hover: false,
      LoadingCourses: false,
    }
  },

  methods: {
    clickCardButton(index, is_open) {
      if (is_open == index) {
        is_open = null
        return is_open
      } else {
        is_open = index
        this.scrollToElement(index)
      }
      return is_open
    },
    scrollToElement(index) {
      const el = this.$refs.courses[index]

      if (el) {
        // Use el.scrollIntoView() to instantly scroll to the element
        el.scrollIntoView()
        // el.scrollTop = el.scrollHeight;
      }
    },

    async searchForCourses() {
      // if(this.search===""){
      //   this.search=
      // }
      this.LoadingCourses = true

      try {
        const data = await this.$axios.$get(`/course/find/${this.search}`)
        if (data === '') {
          this.courses = []
        } else {
          console.log('hey' + data)
          console.log(this.search)
          this.courses = data
        }
      } catch (err) {
        if (err.response) {
          console.log(err)
          this.$buefy.toast.open(err.response.message)
        } else {
          this.$buefy.toast.open('Connection Error: please try again later')
        }
        // return
      }
      this.LoadingCourses = false
    },
    confirmDelete(itemId, code) {
      this.$buefy.dialog.confirm({
        message: 'Are you sure you want to delete this course ??',
        type: 'is-dark',
        confirmText: 'Yes, delete',
        onConfirm: () => this.deleteComponent(itemId, code),
      })
    },

    async deleteComponent(itemId, code) {
      try {
        const deleted_course = await this.$axios.$delete(`/course/${code}`)
        const message = deleted_course.name + 'has been deleted '
        this.$buefy.snackbar.open({
          message: message,
          type: 'is-danger',
          duration: 9000,
          queue: false,
          position: 'is-top',
        })
        this.courses.splice(itemId, 1)
      } catch (err) {
        this.$buefy.toast.open(err.response.message)
        console.log(err)
      }
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
  //   ,  async mounted() {
  // },
}
</script>

