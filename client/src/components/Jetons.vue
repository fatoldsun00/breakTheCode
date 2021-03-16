<template>
  <div class="jetons">
    <ul class="jeton" v-for="(chiffre,index) in jetons" :key="index">
      <li class="jetons__chiffre" :class="'jetons__chiffre--'+chiffre.coul" >
        {{chiffre.val}}
      </li>
    </ul>
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
    jetons: Object
  },
  methods: {
    
  },
  created(){

  }

}
</script>
