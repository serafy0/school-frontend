<template>
  <div class='box'>
    <form
      @submit.prevent="editCourseDate">

      <b-field label="weekday"

      >
        <b-select v-model="course.weekday" placeholder="Select a day" required>

          <option value="MONDAY">MONDAY</option>
          <option value="MONDAY">MONDAY</option>
          <option value="MONDAY">MONDAY</option>
        </b-select>
      </b-field>

      <b-field label="time">
<!--        <b-timepicker  v-model="course.time" inline ></b-timepicker>-->
        <b-input type='time' v-model="course.time" inline ></b-input>


      </b-field>

      <b-field postion="centered" class='has-text-centered'><!-- Label left empty for spacing -->
        <b-button
          type='is-primary'


          size='is-large'

          outlined

          native-type='submit'
        > <strong> edit </strong></b-button>

        <!--                  <b-button type="is-primary" inverted outlined>Inverted</b-button>-->
      </b-field>




    </form>
  </div>
</template>

<script>
import Inspire from '../pages/inspire'
export default {
  components: { Inspire },

  props: {

    code: String

  },

  data() {
return {


  course: {
    weekday: "",
    time:""
  },
  weekdays:[
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]
}

  },
  methods:{
    async editCourseDate(){
      try {
        console.log(this.course.weekday)
        const data = await this.$axios.$post(`course/set_in_table/${this.code}`,this.course);
        // this.children = data
        console.log(data)

        this.$buefy.toast.open(`course date set`)

      }catch (err){
        this.$buefy.snackbar.open( {indefinite: true
          ,message:err.response.data.message})
        console.log(err.response.data.message)



      }

    },
  }
}

</script>
