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
                  >
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
    <div class='box has-background-dark  mb-0'>
      <h1 class='title has-text-warning has-text-centered'>your courses</h1>
    </div>
    <div class='box '>
      <b-table  :data="courses"  :columns='[{field: "code",label:"CODE"},{field: "name",label:"name",},{field: "description",label:"des"}]' paginated per-page='5' card-layout backend-sorting></b-table>

    </div>
  </section>

  </div>

</template>

<script>

export default {
  data() {
    return {
      courses:[{}],
      course: {
        code:"",
        name:"",
        description: "",

      }
    }
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


    async addCourse(){
             try {
       const data = await this.$axios.$post('/course/add',this.course);
       // this.children = data
               console.log(data)
               this.$buefy.toast.open(`course ${data.name} added`)

             }catch (err){
       this.$buefy.snackbar.open( {indefinite: true
                 ,message:err.response.data.message})
               console.log(err.response.data.message)

       // return


     }

   }






  },
  async mounted() {
     await this.fetchRelatedCourses()
  },

}

</script>
