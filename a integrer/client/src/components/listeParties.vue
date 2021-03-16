<template>
  <div class="gamesList">
    <button @click="createGame">creer partie</button>
    <div class="gamesList__container gamesList__container--entete">
      <div class="gamesList__element">ID</div>
      <div class="gamesList__element">Demarré</div>
      <div class="gamesList__element">Nombre Joueurs</div>
      <div class="gamesList__element">Nombre de bots</div>
      <div class="gamesList__element">Joueurs dans la partie</div>
      <div class="gamesList__element">Action</div>
    </div>
    
    <div v-for="(game,index) in games" :key="index"  class="gamesList__container games">
      <div class="gamesList__element">{{game.idGame}}</div>
      <div class="gamesList__element gamesList__started" :class="!game.started?'gamesList__started--true':'gamesList__started--false'"></div>
      <div class="gamesList__element">{{game.nbrJoueurs}} </div>
      <div class="gamesList__element">{{game.nbrBots}} </div>
      <div class="gamesList__element">
        <div v-for="(joueur,nomJoueur) in game.joueurs" :key="nomJoueur">
          {{nomJoueur}} {{game.joueurs[nomJoueur].leader}}
        </div>
      </div>
      <div class="gamesList__container">
        <button class="gamesList__element" v-show="((!game.started && (Object.keys(game.joueurs).length < game.nbrJoueurs)) || Object.keys(game.joueurs).indexOf(name) > -1)" 
          @click="joinGame(game.idGame)">joindre</button>
      </div>
    </div>
    <div v-if="!games.length">
      Aucune partie
    </div>
  </div>
</template>

<script>

import { HTTP } from '../axios-wrapper' 
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('user')

export default {
  name: 'ListeParties',
  data: function () {
    return {
      games: [], 
    }
  },
  computed: {
    ...mapGetters({
      name: 'getName',
    })
  },
  
  methods: {
    async createGame(){ 
      /* eslint-disable no-console */
      let {data: idGame} = await HTTP.post('/game',{nbrJoueurs:2,nbrBots:1})
      this.joinGame(idGame)
    },
    async listGame(){
      let {data} = await HTTP.get('/game')
      this.games = data
    },
    async joinGame(idGame){
      try {
        await HTTP.post(`/game/join/${idGame}`)
        this.$router.push({ name: 'game', params: { idGame } })
      } catch (err) {
        console.log('Todo toaster',err)
      }
    },
  },
  async created(){
    this.listGame()

    this.onMessagefnID = await this.$store.dispatch('WS/add_fn', {
        fn: (message) => {
          console.log(message)
        }
      })
  },
  destroyed () {
    this.$store.commit('WS/remove_fn', this.onMessagefnID)
  },
}
</script>
