<template>
  <div class="login">

    <div class="login__wrapper">
      <div class="login__animationCode animationCode">
        <div v-for="(letter,index) in 'Break the code'" :key="index" class="animationCode__letter">{{letter}}</div>
      </div>
      
      <input class="login__name" type="text" placeholder="Nom" v-model="name" @keyup.enter="login"/>
      <button class="login__send" @click="login">Connexion</button>
    </div>
  </div>
</template>

<script>

import { HTTP } from '../axios-wrapper' 
export default {
  data: function () {
    return {
      name: undefined,
    }
  },
  
  methods: {
    async login(){
      try {
        await HTTP.post('/user',{name:this.name})
        this.$store.commit('user/setName',name)
        this.$router.push('home')
      } catch (error) {
        //TODO
        this.$message('Ceci est un message.');
        this.$message({
          showClose: false,
          message: 'ttt',
          type: 'error'
        })
      }
    },
  },
  async created(){
    
  }
}
</script>
