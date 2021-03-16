const jwt = require('jsonwebtoken')
//const { Users } = require('../Models/userModel')
const { token_secret_login, token_expires_in } = require('../config')
const catchAsync = require('../Services/catchAsync')
const AppError = require('../Services/AppError')

let users = []

const getUsers = ( ) => {
  return users
}

const getUser = (name) => {
   return users.filter(user => user.name==name)
}


const addUser = async ( name ) => {
   //Ajout de l'utilisateur
  try{
    //test des données en entrée
    if (!name) throw new AppError(401,'ERR_USER_ADD_NAME')
    //TODO Revoir ?ID unique en sommes ou login avec compte et password
    if (users.filter((user)=>user.name == name).length) throw new AppError(401,'ERR_USER_ADD_NAME_ALREADY_TAKE')
    users.push({name})

     //Creation jwebtoken et attachement du cookies 
    const token = signToken(name, token_secret_login, {
      expiresIn: token_expires_in
    })
    
    return token
  } catch (err) {
    throw err
  }
}

const getMyInfo = ( token ) => {
  try{
    // Vérification du token
    if (!token)  throw new AppError( new AppError(401,'ERR_AUTH_TOKEN_LOGIN'))
    return jwt.verify(token, token_secret_login)
  }catch{
    throw new AppError(401,'ERR_AUTH_TOKEN_LOGIN')
  }
}

const upAvatar = catchAsync(async ( req, res, next ) => {
  
  res.locals.status = 200
  res.locals.message =  {msg:'TODO upAvatarUser' }
  next()
})

const checkTokenUser = async (token) => {
  // Vérification du token
  try{  
    // Récupération du token
    if (!token) throw new AppError(401,'ERR_AUTH_TOKEN_LOGIN')
    return await jwt.verify(token, token_secret_login)
  }catch{
    throw new AppError(401,'ERR_AUTH_TOKEN_LOGIN')
  }
}

// --------------- Fonctions non exposées, usage interne ---------------
const signToken = (name, token_secret) => {
	const payload = {
		name
	}
	return jwt.sign(payload, token_secret)
}

module.exports = {
  getMyInfo,
  getUsers,
  getUser,
  addUser,
  checkTokenUser
}
