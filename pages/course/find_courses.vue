<template>
<div>
  <div class='container'>
    <b-field>
    <b-input v-model='search' has-icon-left  @input='searchForCourses'></b-input>
    <b-button type='is-dark' @click='searchForCourses' icon-right='magnify' ></b-button>
    </b-field>
  </div>


<div v-if='search!==""'>
<!--  <div v-if='courses!==[]' class="box has-background-light   is-small hero" >-->
<!--    <b-table  :data="courses"  :columns='[{field: "code",label:"code"},{field: "name",label:"name",},{field: "description",label:"description",},]' paginated per-page='5' card-layout backend-sorting></b-table>-->
<!--  </div>-->
<!--  <div>{{courses}}</div>-->
    <div class='container is-fluid pt-3' v-for='(course,index) in courses' ref="courses" :key="index">
      <div class="card has-text-weight-bold  "  >
        <header class="card-header has-background-grey-dark " >
          <p class="card-header-title is-centered is-size-3 has-text-light size-large" >
            {{ course.name }}
          </p>
        </header>
        <div class="card-content has-background-grey-light is-size-5">
          <div class='content' style='word-wrap: break-word;'>
            {{course.description}}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>

export default {

  data() {
    return {
      search:"",
      courses:[]
    }

  },

  methods: {
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
        this.$buefy.toast.open(err)
        // return


      }


    }
  }
//   ,  async mounted() {
// },

}
</script>
