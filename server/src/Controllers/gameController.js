
const { Carte } = require('../Controllers/cartesController')
const { Jeton } = require('../Controllers/jetonsController')
const Chat = require('../Controllers/chatController')
const { wss } = require('../Controllers/WSServerController')

const AppError = require('../Services/AppError')
let games = []

const getGames = () => {
  return games
}

const getGame = (idGame) => {
  return games.filter((game) => game.idGame==idGame)[0]
}

const createGame = ( config, name ) => {
  try{
    let { nbrJoueurs,nbrBots=0 } = config
    if (nbrJoueurs < 2 || nbrJoueurs > 4  || nbrBots < 0 || nbrJoueurs > 3 ) throw new AppError(422,'ERR_GAME_CONFIG_MALFORMED')
    let idGame = Math.random().toString(36).substr(2, 9)
    
    let bots = {}
    for(let i=0;i<nbrBots;i++){
      bots['bot'+i]={bot: true,leader: false}
    }
    //Creation de la room chat
    let idRoom = Chat.createRoom()
    games.push({
      idGame,
      idRoom,
      nbrJoueurs,
      nbrBots,
      started: false,
      joueurs: {...bots},
      tour: {
        carteActif: undefined,
        joueurActif,
        aJouer:[],
        indexTourDeJeu
      },
      pioche: undefined,
      cartes: undefined,
      defausse: []
    })

    return idGame
  } catch (err) {
    throw err
  }
}

const joinGame = ( idGame,name ) => {
  try {
    if (!idGame || !name) throw  new AppError(422,'ERR_GAME_JOIN_INVALID_DATA')
    let game = getGame(idGame)
    const joueurConnu = Object.keys(game.joueurs).indexOf(name) == -1
    //Game started
    if (game.started && joueurConnu) throw new AppError(422,'ERR_GAME_JOIN_GAME_ALREADY_STARTED')
    //Game full ?
    if (Object.keys(game.joueurs).length >= game.nbrJoueurs && joueurConnu) throw new AppError(422,'ERR_GAME_JOIN_FULL')
    //1er joueur connecté devient le leader
    if (Object.keys(game.joueurs).length - game.nbrBots==0) {
       //On ajoute le joueur au jeu
       game.joueurs[name]={leader: true}
    } else {
      game.joueurs[name] = {}
    }
    //Ajout du joueurs dans la room de chat
    Chat.joinRoom(game.idRoom,name)
    return game
  }
  catch(err) {
    throw err
  }
}

const startGame = async ( idGame, name ) => {
  try {
    let game = getGame(idGame)
    let leaderIG = Object.values(game.joueurs).filter((joueur) => joueur.leader)
    //Controle
    if (game.joueurs[name] == undefined) throw new AppError(422,'ERR_GAME_START_PLAYER_NOT_IN_GAME')
    if (game.nbrJoueurs != Object.keys(game.joueurs).length) throw new AppError(422,'ERR_GAME_START_PLAYER_NOT_FULL')
    if (!game.joueurs[name].leader && leaderIG.length) throw new AppError(401,'ERR_GAME_START_PLAYER_NOT_LEADER')
    validateGame(game)
    return initGame(game)
  } catch (err) {
    throw err
  }
  
}

const pickupCard = async (idGame,idCartes,name) => {
  let game = getGame(idGame)
  //Test si joueur actif
  if (name!=game.tour.joueurActif) throw new AppError(401,'ERR_GAME_PICKUPCARD_NOT_YOUR_TURN')
  //if (game.tour.tourDeJeu.indexOf(name)!=game.indexTourDeJeu) throw new AppError(401,'ERR_GAME_PICKUPCARD_NOT_YOUR_TURN')
  game.tour.carteActif=idCartes
}

const reponseToCard = async (idGame,idCartes,response,name) => {
  let game = getGame(idGame)
  //Test si la reponse corresponda une carte actif
  if (game.tour.carteActif != idCartes) throw new AppError(401,'ERR_GAME_RESPONSE_CARD_NOT_ACTIF_CARD')
  //Joueur qui pose la question qui y repond ?
  if (name == game.tour.joueurActif) throw new AppError(401,'ERR_GAME_RESPONSE_NOT_YOUR_TURN')
  //Test de la reponse
  const rep =  Carte.getCarte(idCartes).fn(game.joueurs[name].jetons)
  if (response != rep) throw new AppError(401,'ERR_GAME_RESPONSECARD_WRONG_RESPONSE')

  //On ajoute le joueur au tableau des joueurs ayant joué ce tour ci
  game.tour.aJouer.push(name)

  return rep

}

const tourSuivant = async (idGame) => {
  let game = getGame(idGame)
  let joueursRestant = Object.keys(game.joueurs).filter(name => game.tour.aJouer.indexOf(name) < 0 )
  if (!joueursRestant.length) {
    //Gestion des cartes
      //on passe la carte selectionné dans la defause
    let carteindex = game.cartes.findIndex(carte=>carte.id==game.carteActif)
    game.defausse.push(game.cartes.splice(carteindex,1))
    //on pioche
    if (game.pioche.length) {
      game.cartes.push(game.pioche.splice(0,1))
    }

    //reset du tour
    game.carteActif = undefined,
    game.tour.aJouer = [],
      //joueur suivant
    tabJoueurs = Object.keys(game.joueurs)
    let joueurActifIndex = tabJoueurs.findIndex(joueur=>joueur==game.joueurActif)
    joueurActifIndex++
    if (joueurActifIndex >= tabJoueurs.length) {
      joueurActifIndex=0
    }
    game.joueurActif = tabJoueurs[joueurActifIndex]

    return true
  }
  return false
}

const proposition = async (idGame,joueur,proposition) => {
  try {
    let game = getGame(idGame)
    let jetonsJoueur = game.joueurs[joueur].jetons
    for (jeton of jetonsJoueur){
      for (prop of proposition){
        if (jeton.val != prop.val || jeton.coul != prop.coul) throw new AppError(422,'ERR_GAME_PROPOSITION')
      }
    }
  } catch (err) {
    throw err
  }
}

const paramGame = ( idGame, name, config ) => {
  try{
    let game = getGame(idGame)
    if (!game.joueurs[name].leader) throw new AppError(401,'ERR_GAME_PARAM_PLAYER_NOT_LEADER')
    game = {...game,nbrJoueurs: config.nbrJoueurs,nbrBots: config.nbrJoueurs}
    validateGame(game)
    return game
  } catch (err) {
    throw err
  }
}

const joueurGames = (name) => {
  return games.filter((game) => Object.keys(game.joueurs).indexOf(name))
}

const cleanupGame = (game,name) => {
   // suppression des jetons des autres joueurs
   game = {...game}
   for (joueur in game.joueurs) {
     if (joueur != name) delete game.joueurs[joueur].jetons
   }
   return game
}

/*--------------- Fonctions non expos&es, usage interne ---------------*/

function initGame(game) {
  //initCarte
  game.pioche = Carte.genereCarte()
  //on prends les 6 premieres cartes
  game.cartes = game.pioche.splice(0,6)

  //initJetons
  const jetons = Jeton.genereJetons(game.nbrJoueurs)

  let i = 0
  for (joueur in game.joueurs){
    game.joueurs[joueur].jetons  = jetons[i]
    i++
  }

  let [leaderIG] = Object.values(game.joueurs).filter((joueur) => joueur.leader)
  if (leaderIG) {
    game.tour.joueurActif = leaderIG
  }
  
  game.started = true;
  return game
}

function validateGame(game) {
  try {
    //Game started
    if (game.started) throw new AppError(422,'ERR_GAME_PARAM_GAME_ALREADY_STARTED')
    if (game.nbrJoueurs < Object.keys(game.joueurs).length) throw new AppError(422,'ERR_GAME_PARAM_GAME_FULL')
    return
  } catch (err) {
    throw err
  }
}

module.exports = {
  getGames,
  getGame,
  createGame,
  cleanupGame,
  paramGame,
  joinGame,
  startGame,
  pickupCard,
  proposition,
  joueurGames,
  reponseToCard,
  tourSuivant
};
