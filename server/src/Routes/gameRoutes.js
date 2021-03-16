const express = require('express')
const gameRouter = express.Router()
const gameCtrl = require('../Controllers/gameController')
const catchAsync = require('../Services/catchAsync')
const { wss } = require('../Controllers/WSServerController')

gameRouter.route('/')
  .get(catchAsync(async ( req, res, next ) => {
    try {
      const games = await gameCtrl.getGames()
      res.locals.status = 200
      res.locals.message = games
      return next()
    } catch (err) {
      throw err
    }
  }))
  .post(catchAsync(async ( req, res, next ) => {
      try {       
        const idGame = gameCtrl.createGame(req.body, res.locals.name)
        res.locals.status = 200
        res.locals.message = idGame
        next()
      } catch (err) {
        throw err
      }
  }))


gameRouter.route('/:idGame')
  .get(catchAsync(async ( req, res, next ) => {
    try {
      const game = await gameCtrl.getGame(req.params.idGame)
      if (game) {
        res.locals.status = 200
        res.locals.message = game
      } else {
        res.locals.status = 404
      }
      next()
    } catch (err) {
      throw err
    }
  }))

gameRouter.route('/start/:idGame')
  .post(catchAsync(async ( req, res, next ) => {
  try {
    let game = await gameCtrl.startGame(req.params.idGame,res.locals.name)
    game = gameCtrl.cleanupGame(game,res.locals.name)

    for(let k in game.joueurs) {
      wss.send({
        action: {started: true},
        game
      },k)  
    }
   
    res.locals.status = 201
    next()
  } catch (err) {
    throw err
  }
}))

gameRouter.route('/join/:idGame')
  .post(catchAsync(async ( req, res, next ) => {
  try {
    const game =gameCtrl.joinGame(req.params.idGame,res.locals.name)
    wss.send({
      action: {newPlayer: res.locals.name}
    },Object.keys(game.joueurs))

    res.locals.status = 201
    next()
  } catch (err) {
    throw err
  }
}))
/*
gameRouter.route('/pickupCard/:idGame/:idCarte')
  .post(catchAsync(async ( req, res, next ) => {
  try {
    let game = gameCtrl.getGame(req.params.idGame)
    const reponse = await gameCtrl.pickupCard(req.params.idGame,req.params.idCarte,res.locals.name)
  
    wss.send({
      action: {pickupCard: req.params.idCarte},
      reponse,
      tour: game.tourDeJeu[game.indexTourDeJeu]
    },Object.keys(game.joueurs))

    res.locals.status = 201
    return next()
  } catch (err) {
    throw err
  }
}))*/


gameRouter.route('/pickupCard/:idGame/:idCarte')
  .post(catchAsync(async ( req, res, next ) => {
  try {
    let game = gameCtrl.getGame(req.params.idGame)
    gameCtrl.pickupCard(req.params.idGame,req.params.idCarte,res.locals.name)
  
    wss.send({
      action: {pickupCard: game.tour.carteActif},
    },Object.keys(game.joueurs))

    res.locals.status = 201
    return next()
  } catch (err) {
    throw err
  }
}))

gameRouter.route('/reponseToCard/:idGame/:idCarte')
  .post(catchAsync(async ( req, res, next ) => {
  try {
    let game = gameCtrl.getGame(req.params.idGame)
    let rep = gameCtrl.reponseToCard(req.params.idGame,req.params.idCarte,req.body.response,res.locals.name)

    wss.send({
      action: {reponseCard: req.params.idCarte},
      reponse: rep
    },Object.keys(game.joueurs))

    //Tour suivant ?
    if (game.tourSuivant(req.params.idGame)){
      wss.send({
        action: {newTurn: game.joueurActif},
      },Object.keys(game.joueurs))
    }
    res.locals.status = 201
    return next()
  } catch (err) {
    throw err
  }
}))


gameRouter.route('/param/:idGame')
  .post(catchAsync( ( req, res, next ) => {
  try {
    let game = gameCtrl.paramGame (req.params.idGame,res.locals.name,req.body.config)
    game = gameCtrl.cleanupGame(game,res.locals.name)
    wss.send({
      action: {param: game},
      game,
    },Object.keys(game.joueurs))

    res.locals.status = 201
    return next()
  } catch (err) {
    throw err
  }
}))

gameRouter.route('/proposition/:idGame')
  .post(catchAsync( ( req, res, next ) => {
  try {
    gameCtrl.proposition (req.params.idGame,req.body.joueur,req.body.proposition)
    wss.send({
      action: {
        proposition: true,
      },
      proposition: req.body.proposition,
      joueur: req.body.joueur,
    },Object.keys(game.joueurs))

    res.locals.status = 201
    return next()
  } catch (err) {
    wss.send({
      action: {
        proposition: false,
      },
      proposition: req.body.proposition,
      joueur: req.body.joueur,
    },Object.keys(game.joueurs))
    throw err
  }
}))

module.exports = gameRouter;
