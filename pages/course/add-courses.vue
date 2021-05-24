<template>
  <div>

  <section>

<div class='box'>

              <form
    @submit.prevent="addCourse">

                <b-field label="Course code"

                >
                  <b-input type="text"
                           icon="book"
                           v-model="course.code"
                           maxlength='5'
                           required
                           @input="course.code = course.code.toUpperCase()">
                  </b-input>
                </b-field>
                <b-field label="course name"

                >
                  <b-input
                           v-model="course.name"
                           required
                  >
                  </b-input>
                </b-field>

                <b-field label="description"

                >
                  <b-input
                           type="textarea"
                           v-model="course.description"
                           required
                           maxlength='255'

                  >
                  </b-input>
                </b-field>

                <b-field postion="centered" class='has-text-centered'><!-- Label left empty for spacing -->
                  <b-button
                    type='is-primary'


                    size='is-large'

                    outlined

                    native-type='submit'
                  > <strong> Add </strong></b-button>

                  <!--                  <b-button type="is-primary" inverted outlined>Inverted</b-button>-->
                </b-field>




              </form>
</div>


  </section>
  <section v-if='this.$auth.user&&this.$auth.user.role==="TEACHER"' class='mt-5'>
    <div class='box  has-background-dark  mb-0'>
      <h1 class='title has-text-warning has-text-centered'>your courses</h1>
    </div>


      <div class='container is-fluid pt-3' v-for='(course,index) in courses' :key="index">
        <div class="card has-text-weight-bold has-text-light has-background-warning-dark">
          <header class="card-header">
            <p class="card-header-title is-centered is-size-3 size-large has-text-light ">
              {{ course.name }}
            </p>
          </header>
          <div class="card-content is-size-5">
            <div class="content ">
              {{course.description}}
            </div>
          </div>

            <footer class="card-footer has-text-light">
              <a class="card-footer-item has-text-light outlined ">Save</a>


                <a
                  aria-controls="contentIdForA11y1"
                  class='card-footer-item has-text-light'  icon-left="book" @click='isOpen==index?isOpen=null:isOpen=index'> Edit</a>


              <a class="card-footer-item" @click='confirmDelete(index,course.code)'>Delete</a>
            </footer>
          <b-collapse              :open="isOpen == index"
                                   @open="isOpen = index"
                                   animation="slide"
                                    aria-id="contentIdForA11y1">

            <ModalForm :course='course' ></ModalForm>

          </b-collapse>

        </div>
      </div>


  </section>

  </div>

</template>

<script>
import ModalForm from '~/components/ModalForm'

export default {
  data() {
    return {
      isOpen: null,
      courses:[{}],
      counter:0,

      course: {
        code:"",
        name:"",
        description: "",

      }
    }
  },
  components: {
    ModalForm
  },


  methods:{
    async fetchRelatedCourses() {
      try {
        const data = await this.$axios.$get('/course/teacher/taught_by');
        console.log("hey" +data)
        this.courses = data
      }catch (err){
        console.log(err)
        this.$buefy.toast.open(err)
        // return


      }
    },
      confirmDelete(itemId, code) {
        this.$buefy.dialog.confirm({
          message: 'Are you sure you want to delete this course ??',
          type: 'is-danger',
          confirmText:'Yes, delete',
          onConfirm: () => this.deleteComponent(itemId,code)
        })},


    async deleteComponent(itemId,code) {
      try {
        const deleted_course = await this.$axios.$delete(`/course/${code}`)
        this.$buefy.toast.open(deleted_course.name+"has been deleted ")
        this.courses.splice(itemId, 1)

      }catch (err){
        this.$buefy.toast.open(err)
        console.log(err)

      }
    },



    async addCourse(){
      this.course.code=this.course.code.toUpperCase();
             try {
       const data = await this.$axios.$post('/course/add',this.course);
       // this.children = data
               console.log(data)
               this.$buefy.toast.open(`course ${data.name} added`)
               this.courses.push(data)

             }catch (err){
       this.$buefy.snackbar.open( {indefinite: true
                 ,message:err.response.data.message})
               console.log(err.response.data.message)

       // return


     }

   },
    // cardModal(){                this.$buefy.modal.open({
    //   parent: this,
    //   component: ModalForm,
    //   hasModalCard: true,
    //   trapFocus: true,
    //   class:"has-background-primary"
    // })








  },
  async mounted() {
     await this.fetchRelatedCourses()
  },

}

</script>
