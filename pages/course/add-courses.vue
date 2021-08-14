<template>
  <div>

  <section>

    <div class='container is-align-content-center'>
<div class='box '>

              <form
    @submit.prevent="addCourse">

                <b-field label="Course code"

                >
                  <b-input
                           @keydown.native.space.prevent

                           type="text"
                           icon="book"
                           v-model="course.code"
                           maxlength='5'
                           required
                           @input="course.code = course.code.toUpperCase().replace(' ','')">
                  </b-input>
                </b-field>
                <b-field label="course name"

                >
                  <b-input
                    maxlength='255'
                    has-counter="false"
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
</div>


  </section>
    <div class='box  has-background-dark  mt-6 mb-0'>
      <h1 class='title has-text-warning has-text-centered'>your courses</h1>
    </div>

    <section v-if='this.$auth.user&&this.$auth.user.role==="TEACHER"' class=' columns is-multiline mt-0'>

      <div class='column is-half is-desktop  pt-3' v-for='(course,index) in courses' ref="courses" :key="index">
        <div class="card has-text-weight-bold  "  >
          <header class="card-header has-background-grey-dark " >
            <nuxt-link :to="'/course/'+course.code"  class="card-header-title is-centered is-size-3 has-text-light size-large" >
              {{ course.name }}

            </nuxt-link>
<!--            <nuxt-link class="card-footer-item" :to="'/course/'+course.code" >code</nuxt-link>-->



          </header>


          <div class="card-content has-background-grey-light is-size-5">
            <div class='content' style='word-wrap: break-word;'>
              <p class='is-size-4'>{{course.description}}</p>
              <p class='is-size-6  has-text-right has-text-grey-dark'> course code: {{course.code}}</p>

            </div>

          </div>
          <b-collapse              :open="isOpen == index"
                                   @open="isOpen = index"
                                   animation="slide"



                                   aria-id="contentIdForA11y1">

            <ModalForm :is_open.sync="isOpen" :course='course' ></ModalForm>

          </b-collapse>
          <b-collapse              :open="isOpen2 == index"
                                   @open="(isOpen2 = index)&&(isOpen=null)"
                                   animation="slide"

                                   aria-id="contentIdForA11y12"
          >

            <edit-course-time  :code='course.code'></edit-course-time>

          </b-collapse>


          <footer class="card-footer ">
              <a class="card-footer-item  " aria-controls="contentIdForA11y12" @click='isOpen2=clickCardButton(index,isOpen2)'>date</a>


                <a
                  aria-controls="contentIdForA11y1"
                  class='card-footer-item   '  icon-left="book" @click='isOpen=clickCardButton(index,isOpen)'> Edit</a>


              <a class="card-footer-item  " @click='confirmDelete(index,course.code)'>Delete</a>
            </footer>


        </div>
      </div>


  </section>

  </div>

</template>

<script>
import ModalForm from '~/components/ModalForm'
import editCourseTime from '../../components/editCourseTime'
export default {
  data() {
    return {
      isOpen: null,
      isOpen2: null,
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
    ModalForm,
    editCourseTime,
  },


  methods:{
    clickCardButton(index,is_open){
      if(is_open==index){
        is_open=null;
        return is_open

      }else{is_open=index;
        this.scrollToElement(index)
      }
      return is_open

    },
    scrollToElement(index) {
      const el = this.$refs.courses[index];

      if (el) {
        // Use el.scrollIntoView() to instantly scroll to the element
        el.scrollIntoView();
        // el.scrollTop = el.scrollHeight;
      }
    },
    async fetchRelatedCourses() {
      try {
        const data = await this.$axios.$get('/course/teacher/taught_by');
        console.log("hey" +data)
        this.courses = data
      }catch (err){
        console.log(err)
        if(err.response) {
          this.$buefy.toast.open({indefinite: true,queue:false,message:err.response.data},)
        }
        // return


      }
    },
      confirmDelete(itemId, code) {
        this.$buefy.dialog.confirm({
          message: 'Are you sure you want to delete this course ??',
          type: 'is-dark',
          confirmText:'Yes, delete',
          onConfirm: () => this.deleteComponent(itemId,code)
        })},


    async deleteComponent(itemId,code) {
      try {
        const deleted_course = await this.$axios.$delete(`/course/${code}`)
        const message=deleted_course.name+"has been deleted "
        this.$buefy.snackbar.open({message:message,type:"is-danger", duration:9000,queue:false,position:"is-top"})
        this.courses.splice(itemId, 1)

      }catch (err){
        this.$buefy.toast.open(err)
        console.log(err)

      }
    },



    async addCourse(){
      //clear whitespace
      this.course.code=this.course.code.toUpperCase().replace(/ /g,'');
      // this.course.name=this.course.name.replace(/ /g,'')
      // this.course.description=this.course.description.replace(/ /g,'')

      try {
       const data = await this.$axios.$post('/course/add',this.course);
       // this.children = data
               console.log(data)
               this.$buefy.toast.open({message:`course ${data.name} added`,type:"is-success"})
               this.courses.push(data)
               this.course.code="";
               this.course.name=""
               this.course.description=""


             }catch (err){
       this.$buefy.snackbar.open( {indefinite: true,queue:false
                 ,message:err.response.data.message,type:"is-danger"})
               console.log(err.response.data.message)

       // return


     }

   },








  },
  async mounted() {
     await this.fetchRelatedCourses()
  },

}

</script>
