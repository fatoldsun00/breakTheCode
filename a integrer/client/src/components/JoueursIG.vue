<template>
  <div class="joueurIG">
    <div class="joueurIG__joueur" :class="{['joueurIG__joueur--leader']:joueur.leader}" 
      v-for="(joueur,name) in joueurs" :key="name" @click="selectJoueur()">{{name}}
    </div> 
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
    selectJoueur(){
      
    }
  },
  created(){

  }

}
</script>
