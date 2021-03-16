<template>
  <div @click="$emit('update:carteSel',id )" class="card" :class="{['card--display']: carteSel==id}">
    <!--<div class="card__label">
      //<div class="card__text" v-for="index in 40" :key="index">{{label}}</div> //Animaation marjane
      //<div class="card__text">
      // <div v-for="(letter,index) in label" :key="index" class="card__letter">{{letter}}</div>
      //</div> //Animaation jeremy
      
      <div class="card__text" v-for="index in 40" :key="index">{{label}}</div> 


    </div> //Animaation Marjane-->

    <div class="card__body">
      {{label}}
    </div>
    <div v-if="carteSel==id">
      <button class="card_button icon icon--valider" @click.stop="$emit('carteSel:pickupCard')"></button>
      <button class="card_button icon icon--annuler"></button>
      <button class="card_button icon icon--precedent" @click.stop="$emit('carteSel:previous')"></button>
      <button class="card_button icon icon--suivant" @click.stop="$emit('carteSel:next')"></button>
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
  computed: {
    
  },
  props: {
    label: String,
    id: Number,
    carteSel:Number
  },
  methods: {
  },
  created(){

  }

}
</script>
