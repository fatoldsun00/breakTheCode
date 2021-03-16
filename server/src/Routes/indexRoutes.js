const app = require('express')
const frontRouter = app.Router()
const user = require('../Controllers/userController')
const AppError = require('../Services/AppError')
const { sFrontError } = require('../Services/errorHandler')

//verif si authentifié
frontRouter.use(async (req,res,next) => {
  if (req.path != '/user' || req.method != "POST") {
    try{
      //Controle Cookies
      const jwdDecoded = await user.checkTokenUser(req.cookies.access_token)
      res.locals.name = jwdDecoded.name
    } catch (err) {
      res.cookie('access_token', undefined, { expires: 0, maxAge: 0 })
      next(err)
    }
  }
  next()
})

// Routes
const userRoutes = require('./userRoutes')
const gameRoutes = require('./gameRoutes')
const chatRoutes = require('./chatRoutes')



//Montage des routes
frontRouter.use('/user', userRoutes)
frontRouter.use('/game', gameRoutes)
frontRouter.use('/chat', chatRoutes)

//envoie de la reponse
frontRouter.use(async (req, res, next) => {
  try{
    if (res.locals.status==undefined) throw new AppError(404, 'RETURN UNDEFINED')
    await res.status(res.locals.status).json(res.locals.message)
  }catch(err){
    next(err)
  }
})
//Handle error
frontRouter.use(sFrontError)

module.exports = frontRouter
