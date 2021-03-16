<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { HTTP } from './axios-wrapper' 

export default {
  name: 'app',
  data: function () {
    return {
    
    }
  },
  components: {

  },
  methods: {
    
  },
  async created(){
    try {
      //Y a t il un jeton valide (cookies)
    console.log('ighggggg',)

      let rep = await HTTP.get('/user/me')
      console.log('ici',rep)
      this.$store.commit('user/setName',rep.data.name)
      //Co au WS
      await this.$store.dispatch('WS/COWS')
      // console.log(this.$router)
      if (this.$router.currentRoute.path == '/login') {
        this.$router.push('home')
      }
    } catch (err) {
      this.$router.push('login')
    }
  }
}
</script>
