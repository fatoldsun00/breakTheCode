const express = require('express')
const chatRouter = express.Router()
const chatCtrl = require('../Controllers/chatController')
const catchAsync = require('../Services/catchAsync')
const { wss } = require('../Controllers/WSServerController')

chatRouter.route('/')
  .get(catchAsync(async ( req, res, next ) => {
    try {
      res.locals.status = 200
      res.locals.message =  await chatCtrl.getRooms()
      return next()
    } catch (err) {
      throw err
    }
  }))
  .post(catchAsync(async ( req, res, next ) => {
      try {       
        const idRoom = chatCtrl.createRoom()
        res.locals.status = 200
        res.locals.message = idRoom
        next()
      } catch (err) {
        throw err
      }
  }))

chatRouter.route('/send/:idRoom')
  .post(catchAsync(async ( req, res, next ) => {
    try {
      const room = chatCtrl.getRoom(req.params.idRoom)
      wss.send({
        action: { chatMessage: true },
        from:res.locals.name,
        message: req.body.message
      },Object.keys(room.users))

      res.locals.status = 201
      return next()
    } catch (err) {
      throw err
    }
  }))
  
chatRouter.route('/join/:idRoom')
  .post(catchAsync(async ( req, res, next ) => {
    try {       
      const idRoom = chatCtrl.createRoom()
      res.locals.status = 200
      res.locals.message = idRoom
      next()
    } catch (err) {
      throw err
    }
}))

chatRouter.route('/join/:idRoom')
  .get(catchAsync(async ( req, res, next ) => {
    try {
      const room = chatCtrl.joinGame(req.params.idGame,res.locals.name)
      wss.send({
        action: {newChatUser: res.locals.name}
      },Object.keys(room.users))
      res.locals.status = 201
      return next()
    } catch (err) {
      throw err
    }
  }))

module.exports = chatRouter;
