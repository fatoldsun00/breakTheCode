<template>
  <div>
    <button @click="createGame">creer partie</button>

    list des parties

    <div class="gamesList">
      <div class="gamesList__element gamesList__element--entete">
        <div>ID</div>
        <div>Demarré</div>
        <div>Nombre Joueurs</div>
        <div>Nombre de bots</div>
        <div>Joueurs dans la partie</div>
        <div>Action</div>
      </div>
      
      <div v-for="(game,index) in games" class="gamesList__element" :key="index">
        <div>{{game.idGame}}</div>
        <div>{{game.started}}</div>
        <div>{{game.nbrJoueurs}} </div>
        <div>{{game.nbrBots}} </div>
        <div>{{game.nbrJoueursIG}} </div>
        <div>
          <div v-for="(joueur,nomJoueur) in game.joueurs" :key="nomJoueur">
            {{nomJoueur}} {{game.joueurs[nomJoueur].leader}}
          </div>
        </div>
        <div>
          <button v-show="((!game.started && (Object.keys(game.joueurs).length < game.nbrJoueurs)) || Object.keys(game.joueurs).indexOf(name) > -1)" 
            @click="joinGame(game.idGame)">joindre</button>
        </div>
      </div>
      <div v-if="!games.length">
        Aucune partie
      </div>
    </div>
  </div>
</template>

<script>

import { HTTP } from '../axios-wrapper' 
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('user')

export default {
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
  }
}
</script>
