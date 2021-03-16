const WebSocket = require('ws')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const gameCtrl = require('./gameController')
const chatCtrl = require('./chatController')
const { token_secret_login } = require('../config')

const wss = (() => {
  //creation du serveur de socket
  const Server = new WebSocket.Server({ port: 8090 });
  let clients = {}

  Server.on('connection', async (ws,req) => {
    //Verif du token
    // Récupération du token
    try {
      req.JWTDecoded = await decodeJWT(req)
      const name = req.JWTDecoded.name
      //Si un client avec ce nom existe et que le path est different
      if (clients[name] == undefined || clients[name].url != req.url) {
        clients[name] = {url: req.url,ws: ws}
      } else {
        clients[name].ws = ws
      }      
      clients[name].isAlive = true;
      clients[name].ws.on('pong', heartbeat);
    } catch (err) {
      ws.send(JSON.stringify(err))
      ws.close()
    }
  });

  const send = (message,clientsToSend) => {
    if (typeof clientsToSend === "string" && clients[clientsToSend] && clients[clientsToSend].ws) {
      clients[clientsToSend].ws.send(JSON.stringify(message))
    } else if (clientsToSend instanceof WebSocket) {
      clientsToSend.send(JSON.stringify(message))
    } else {
      for(cliName of clientsToSend) {
        if (clients[cliName] && clients[cliName].ws) {
          clients[cliName].ws.send(JSON.stringify(message))
        }
      }
    }
  }

  /*--------------- Fonctions non exposées, usage interne ---------------*/

  const decodeJWT = async (req) => {
    if (!req.headers.cookie) throw {err:"Vous n êtes pas identifié"}

    const {access_token} = cookie.parse(req.headers.cookie)
    // Vérification du token
    try{
      let decoded = await jwt.verify(access_token, token_secret_login)
      return decoded
    }catch (err){
      throw {err:"Mauvaise authentification"}
    }
  }
  
  const heartbeat = () => {
    this.isAlive = true;
  }

  const interval = setInterval(function ping() {
    Object.values(clients).forEach(function each(client) {
      if (client.isAlive === false) {
        //client dans une partie ?
        const games = gameCtrl.joueurGames(this.name)
        for (game in games)
        send({
          action: { deconnexion: this.name }
        },game.joueurs)

        //client du chat ?
        const rooms = chatCtrl.userRooms(this.name)
        for (room in rooms)
        send({
          action: { deconnexion: this.name }
        },room.users)

        return client.ws.terminate()
      }
      client.isAlive = false;
      client.ping(()=>{});
    });
  }, 30000);
  
  return {
    send
  }

})()

module.exports = {
  wss
};
