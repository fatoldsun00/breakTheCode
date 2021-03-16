<template>
  <div class="card">
    <div class="card__label">
      <!--<div class="card__text" v-for="index in 40" :key="index">{{label}}</div> //Animaation marjane-->
      <!--<div class="card__text">
        <div v-for="(letter,index) in label" :key="index" class="card__letter">{{letter}}</div>
      </div> //Animaation jeremy-->
      <div class="card__text" v-for="index in 40" :key="index">{{label}}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Cartes',
  data: function () {
    return {
     
    }
  },

  props: {
    label: String
  },
  methods: {
    
  },
  created(){

  }

}
</script>
