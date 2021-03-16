<template>
  <div class="jetons">
    <div v-for="(chiffre,index) in jetons" :key="index" class="jetons__container">
      <div :data-chiffre="chiffre.val" class="jetons__chiffre" :class="'jetons__chiffre--'+chiffre.coul + ' ' +'jetons__chiffre--'+chiffre.val">
        {{chiffre.val}}
      </div>
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
    jetons: Array
  },
  methods: {
    
  },
  created(){

  }

}
</script>
