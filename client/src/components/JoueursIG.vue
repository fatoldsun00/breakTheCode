<template>
  <div class="joueurIG">
    <ul class="joueurIG__liste">
      <li class="joueurIG__joueur" v-for="(joueur,name) in joueurs" :key="name">{{name}}</li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'JoueursIG',
  data: function () {
    return {
     
    }
  },
  props: { joueurs: Object },
  methods: {
    
  },
  created(){

  }

}
</script>
