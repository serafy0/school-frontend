<template>

<p>course: {{course}}</p>

</template>




<script>

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


  // asyncData({ params }) {
  //   // called every time before loading the component
  //   return {
  //     course_code: params.course_page
  //   }
  // },
  methods:{
    async findCourse() {
      // if(this.search===""){
      //   this.search=
      // }
      try {
        const data = await this.$axios.$get(`/course/${this.$route.params.course_page}`);
          // console.log("hey" + data)
          // console.log(this.search)
          this.course = data
      } catch (err) {
        console.log(err)
        this.$buefy.toast.open(err)
        // return
      }


    },

  },
  async mounted() {
    await this.findCourse()
  },

}
</script>
