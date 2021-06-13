<template>
<div>
  <div class='columns is-centered'>
    <b-field class='column is-half' >
    <b-input v-model='search' has-icon-left icon='magnify'  @input='searchForCourses' expanded rounded></b-input>
<!--    <b-button type='is-dark' @click='searchForCourses' ' ></b-button>-->
    </b-field>
  </div>


<div class='columns is-vcentered is-multiline' v-if='search!==""'>
<!--  <div v-if='courses!==[]' class="box has-background-light   is-small hero" >-->
<!--    <b-table  :data="courses"  :columns='[{field: "code",label:"code"},{field: "name",label:"name",},{field: "description",label:"description",},]' paginated per-page='5' card-layout backend-sorting></b-table>-->
<!--  </div>-->
<!--  <div>{{courses}}</div>-->
    <div class=' column is-narrow cardheader is-one-third-desktop is-half-tablet  mt-2 pt-3' v-for='(course,index) in courses' ref="courses" :key="index">
      <div class="card has-text-weight-bold "   >
        <header class="card-header has-background-grey-dark card-head" >
        >
          <nuxt-link :to="'/course/'+course.code"  class="card-header-title is-centered is-size-3 has-text-light size-large" >
            {{ course.name }}

          </nuxt-link>
        </header>
        <nuxt-link :to="'/course/'+course.code">

        <div class="card-content has-text-dark has-background-grey-light is-size-5">
          <div class='content' style='word-wrap: break-word;'>
            {{course.description}}
          </div>
        </div>
        </nuxt-link>

        <b-collapse              :open="isOpen == index"
                                 @open="isOpen = index"
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


        <footer v-if='$store.state.auth.user&&$store.state.auth.user.id===course.teacher_id' class="card-footer ">
          <a class="card-footer-item  " aria-controls="contentIdForA11y12" @click='clickCardButton(index)'>date</a>


          <a
            aria-controls="contentIdForA11y1"
            class='card-footer-item   '  icon-left="book" @click='clickCardButton(index)'> Edit</a>


          <a class="card-footer-item  " @click='confirmDelete(index,course.code)'>Delete</a>
        </footer>
        <footer v-else-if='$store.state.auth.user&&$store.state.auth.user.role==="STUDENT"'>
          <a class="card-footer-item  " @click='registerStudentToCourse(course.code)'>register</a>

        </footer>

      </div>
    </div>
  </div>
</div>
</template>

<script>

export default {

  data() {
    return {
      isOpen: null,
      isOpen2: null,
      search:"",
      courses:[],
      hover:false
    }

  },

  methods: {
    clickCardButton(index){
      if(this.isOpen==index){this.isOpen=null;
      }else{this.isOpen=index;
        this.scrollToElement(index)
      }
    },
    scrollToElement(index) {
      const el = this.$refs.courses[index];

      if (el) {
        // Use el.scrollIntoView() to instantly scroll to the element
        el.scrollIntoView();
        // el.scrollTop = el.scrollHeight;
      }
    },

    async searchForCourses() {
      // if(this.search===""){
      //   this.search=
      // }
      try {
        const data = await this.$axios.$get(`/course/find/${this.search}`);
        if(data===""){
          this.courses=[]
        }else {
          console.log("hey" + data)
          console.log(this.search)
          this.courses = data
        }
      } catch (err) {
        console.log(err)
        this.$buefy.toast.open(err.response.message)
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
        this.$buefy.toast.open(err.response.message)
        console.log(err)

      }
    },
    async registerStudentToCourse(course_code){
      try{
        const data = await this.$axios.$post(`/p/registerCourse/${course_code}`)
        this.$buefy.toast.open("you just registered to course");


      }catch (err){
        if(err.response.status==409){
          this.$buefy.toast.open(
            {message:"you are alerady registerd for this course",
              type:"is-danger"
            },

        )

        }else {

          this.$buefy.toast.open(err.response.message)
          console.log(err)
        }
      }
    }

  }
//   ,  async mounted() {
// },

}
</script>

<style>
.cardheader:hover{

  border: 3px solid deeppink;
  /*  padding-top: 40px;*/
  /*padding-bottom: 40px;*/
  /*padding-left: 10px;*/
  -webkit-transform:translateY(-18px);
  transform: translateY(-18px);
  transition-duration: 500ms;
  /*transition: border-width 0.6s ease;*/
  /*animation-duration: 100000ms;*/


   }
</style>
