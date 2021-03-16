<template>
  <div class="chat">
    <ul class="chat__messages">
      <li v-for="(message,index) in messages" :key="index">
        {{message}}
      </li>
      <input class="chat__toSend" type="text" placeholder="Dites quelque chose !" v-model="toSend"/>
      <button class="chat__send" @click="send">Envoyer</button>
    </ul>
  </div>
</template>

<script>

import { HTTP } from '../axios-wrapper' 
/* eslint-disable no-console */

export default {
  name: 'Chat',
  data: function () {
    return {
      messages: [],
      toSend: ''
    }
  },

  props: {
    idRoom: String
  },
  methods: {
    async send(){
      try {
        await HTTP.post(`/chat/send/${this.idRoom}`,{message: this.toSend})
        this.toSend = ''
      } catch (err) {
        console.log('Todo toaster',err)
      }
    }
  },
  async created(){
    //ecouteur message WS chat
    try {
      this.onMessagefnID = await this.$store.dispatch('WS/add_fn', {
        fn: (message) => {
          console.log(message)
          if (message.action.chatMessage) {
            this.messages.push(message.message)
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
