<template>
  <div class='box'>
<form
  @submit.prevent="editCourse">

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
</template>

<script>
export default {


  props: {

    course:Object

  },
  methods:{
    async editCourse(){
      try {
        const data = await this.$axios.$put(`/course/${this.course.code}`,{name:this.course.name,description:this.description});
        // this.children = data
        console.log(this.course)
        console.log(data)
        this.$buefy.toast.open(`course ${data.name} edited`)

      }catch (err){
        this.$buefy.snackbar.open( {indefinite: true
          ,message:err.response.data.message})
        console.log(err.response.data.message)

        // return


      }

    },
  }
}

</script>
