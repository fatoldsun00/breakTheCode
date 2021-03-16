<template>
  <div class="gameView">
    
    <div class="gameView__L gameView__L--1">
      <Tongue classTarget="gameView__L" classBEMTarget="gameView"/>
      <div class="gameView__indices_jetons"> 
      0 1 2 3 4 5 6 7 8 9 <span class="gameView__param">Change param</span>
      </div>
      <div class="gameView__info"> 
        <div>ID : {{idGame}}</div>
        <div>Démarré : {{game.started}}</div>
        <div>Nombre Joueurs : {{game.nbrJoueurs}}</div>
        <div>Nombre de bots : {{game.nbrBots}}</div>
        <div>Joueurs dans la partie : {{game.nbrJoueursIG}}</div>
        <button v-show="!game.started" @click="startGame(game.idGame)">démarrer</button>
      </div>
    </div>  
    <div class="gameView__L gameView__L--2">
      TODO BUG{{!game.started}}
      <Tongue classTarget="gameView__L" :developper="!game.started" classBEMTarget="gameView"/>
      <div class="gameView__card-container">
          <Cartes v-for="carte in game.cartes" :key="carte.id" 
            :carteSel.sync="carteSel" 
            @carteSel:previous="carteSel=carteSel--<=0?game.cartes.length-1:carteSel--"
            @carteSel:next="carteSel=carteSel++>=game.cartes.length-1?0:carteSel++"
            @carteSel:pickupCard="pickupCard(carte.id)"
            :class="{ [`card--display`]: carte.id==carteSel }" :label="carte.label" :id="carte.id"></Cartes>
      </div>
      <div class="gameView__chat"> 
        <Chat :idRoom="game.idRoom" />
      </div>
    </div>
    <div class="gameView__L gameView__L--3" >
      <Tongue classTarget="gameView__L" classBEMTarget="gameView" :display="game.started"/>
      <div class="gameView__blockIndicesJoueurs">
        <div class="gameView__indices"> </div>
        <div class="gameView__joueurs"> 
          <JoueursIG :joueurs="game.joueurs"/>
        </div>
      </div>
      <div class="gameView__jetons"> 
        <Jetons :jetons="game.jetons"/>
      </div>
    </div>
  </div>
</template>

<script>

import { HTTP } from '../axios-wrapper' 
import Cartes from '@/components/Cartes'
import JoueursIG from '@/components/JoueursIG'
import Chat from '@/components/Chat'
import Jetons from '@/components/Jetons'
import Tongue from '@/components/Tongue'

/* eslint-disable no-console */
export default {
  data: function () {
    return {
      idGame: this.$route.params.idGame,
      game: {},
      onMessagefnID: undefined,
      name: this.$store.getters['user/getName'],
      carteSel: undefined
    }
  },
  components: {
    Cartes,
    JoueursIG,
    Chat,
    Jetons,
    Tongue,
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
    selectNextCard(){
      console.log(this.carteSel);
      this.carteSel=this.carteSel++>=this.game.cartes.length?0:this.carteSel++
      console.log(this.carteSel);
    },
  },
  async created(){
    //On reference la partie active dans le store
    //Recuperation des informations de la partie
    try {
      this.name = this.$store.getters['user/getName']
      let { data } = await HTTP.get(`/game/${this.idGame}`)
      this.game = data
      this.game.jetons = this.game.joueurs[this.name].jetons

      //TODO retour WS
      this.onMessagefnID = await this.$store.dispatch('WS/add_fn', {
        fn: (message) => {
          //demarrage partie
          if (message.action.started) {
            this.game = message.game
            this.game.jetons = message.game.joueurs[this.name].jetons
          }

          //pickup card
          if (message.action.pickupCard) {
            this.carteSel = message.action.pickupCard
            //Si c'est le joueur en cour on demande la reponse
            if (game.tour.joueurActif == this.name) {
              //TODO afficher reposne
            } else {
              //TODO wait reponse
            }
          }

        }
      })
    } catch (err) {
      //TODO ERR
      console.log(err)
      this.$router.push({ name: 'home', params: { } })
    }
  },
  destroyed () {
    this.$store.commit('WS/remove_fn', this.onMessagefnID)
  }
}
</script>
