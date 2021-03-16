const express = require('express')
const userRouter = express.Router()
const userController = require('../Controllers/userController')
const catchAsync = require('../Services/catchAsync')

userRouter.route('/')
  .get(catchAsync(async ( req, res, next ) => {
    const users = userController.getUsers()
    res.locals.status = 200
    res.locals.message =  users
  }))
  .post(catchAsync(async ( req, res, next ) => {
    //try {
      const token = await userController.addUser(req.body.name)
      // Puis on l'envoie via un cookie
      res.cookie('access_token', token, { 
        maxAge: Math.floor(Date.now() / 1000) + (60 * 60),
        expires: Math.floor(Date.now() / 1000) + (60 * 60),
        httpOnly: true, 
        secure: false,
        sameSite: 'strict'
      })

      res.locals.status = 201
      next()
   // } catch (err) {
    //  throw err
   // }
  }))

userRouter.route('/me')
  .get(catchAsync(async ( req, res, next ) => {
    const userInfo = userController.getMyInfo(req.cookies.access_token)
    res.locals.status = 200
    res.locals.message =  userInfo
    next()
  }))
    
userRouter.route('/:idUser((?!me))')
  .get(catchAsync(async ( req, res, next ) => {
      const userInfo = userController.getUser(res.locals.name)
      res.locals.status = 200
      res.locals.message =  userInfo
      next()
    }))


module.exports = userRouter;
