<template>
  <div class="tongue" :class="classBEM+'__tongue'" @click="clickFire()" v-if="display">
    
  </div>
</template>

<script>

export default {
  /* eslint-disable no-console */

  name: 'Tongue',
  data: function () {
    return {
     classBEM: undefined,
    }
  },
  watch: {
    developper: function(newVal){
      console.log(newVal);
      if(newVal) this.$el.parentElement.classList.add(this.classTarget+"--developpe")
      else this.$el.parentElement.classList.remove(this.classTarget+"--developpe")
    }
  },
  props: {
    classTarget: String,
    classBEMTarget:  {
      default: undefined,
      type: String
    },
    display: {
      default: true,
      type: Boolean
    },
    developper:{
      default: false,
      type: Boolean
    },
  },

  methods: {
    clickFire() {
      console.log(this.$el.parentElement.classList.contains(this.classTarget+"--developpe"));
     if (this.$el.parentElement.classList.contains(this.classTarget+"--developpe")) {
        this.$el.parentElement.classList.remove(this.classTarget+"--developpe")
      } else {
        this.$el.parentElement.classList.add(this.classTarget+"--developpe")
      }
    }
  },
  mounted(){
    console.log(this)
    if (!this.classBEMTarget) {
      this.classBEM = this.classTarget
    } else {
      this.classBEM = this.classBEMTarget
    }
    //if(this.developpe) this.clickFire()
  },
  destroy() {
  } 
}
</script>
