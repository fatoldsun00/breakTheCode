<template>
  <div class="gameView">
    <div class="gameView__info"> 
      <div>ID : {{idGame}}</div>
      <div>Démarré : {{game.started}}</div>
      <div>Nombre Joueurs : {{game.nbrJoueurs}}</div>
      <div>Nombre de bots : {{game.nbrBots}}</div>
      <div>Joueurs dans la partie : {{game.nbrJoueursIG}}</div>
      <button v-show="!game.started" @click="startGame(game.idGame)">démarrer</button>
    </div>
    <div class="gameView__joueurs"> 
      <JoueursIG :joueurs="game.joueurs"/>
    </div>
    <div class="gameView__card-container">
      <div class="card-container" v-for="(carte,index) in game.cartes" :key="index">
        <Cartes class="card-container__card" @click="pickupCard(carte.id)" :label="carte.label" ></Cartes>
        {{carte.reponse}}
      </div>
    </div>
    <div class="gameView__chat"> 
      <Chat :idRoom="game.idRoom" />
    </div>
    <div class="gameView__jetons"> 
      <Jetons :jetons="game.joueurs[name].jetons" />
    </div>
    <div class="gameView__param"> 
    </div>
    <div class="gameView__indices"> 
    </div>
  </div>
</template>

<script>

import { HTTP } from '../axios-wrapper' 
import Cartes from '@/components/Cartes'
import JoueursIG from '@/components/JoueursIG'
import Chat from '@/components/Chat'
import Jetons from '@/components/Jetons'

/* eslint-disable no-console */
export default {
  data: function () {
    return {
      idGame: this.$route.params.idGame,
      game: {},
      onMessagefnID: undefined,
      name: this.$store.getters['user/getName']
    }
  },
  components: {
    Cartes,
    JoueursIG,
    Chat,
    Jetons
  },
  methods: {
    async startGame(idGame){
      try {
        await HTTP.post(`/game/start/${this.idGame}`)
        this.idGame = idGame
      } catch (err) {
        console.log('Todo toaster',err)
      }
    },
    async pickupCard(idCartes){
      try {
        await HTTP.post(`/game/pickupCard/${this.idGame}/${idCartes}`)
      } catch (err) {
        console.log('Todo toaster',err)
      }
    },
  },
  async created(){
    //On reference la partie active dans le store
    //Recuperation des informations de la partie
    try {
      this.name = this.$store.getters['user/getName']
      let { data } = await HTTP.get(`/game/${this.idGame}`)
      this.game = data

      //TODO retour WS
      this.onMessagefnID = await this.$store.dispatch('WS/add_fn', {
        fn: (message) => {
          if (message.action.started) {
            this.game = message.game
          }
        }
      })
    } catch (error) {
      this.$router.push({ name: 'home', params: { } })
    }
  },
  destroyed () {
    this.$store.commit('WS/remove_fn', this.onMessagefnID)
  }
}
</script>
