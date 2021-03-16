
const AppError = require('../Services/AppError')
let rooms = []

const getRooms = () => {
  return rooms
}

const getRoom = (idRoom) => {
  return rooms.filter((rooms) => rooms.idRoom==idRoom)[0]
}

const createRoom = () => {
  try{
    let idRoom = Math.random().toString(36).substr(2, 9)

    rooms.push({
      idRoom,
      users: {}
    })
    return idRoom
  } catch (err) {
    throw err
  }
}

const joinRoom = ( idRoom,name ) => {
  try {
    let room = getRoom(idRoom)
    room.users[name] = {}
  }
  catch(err) {
    throw err
  }
}

const userRooms = (name) => {
  return rooms.filter((room) => Object.keys(room.users).indexOf(name))
}
/*--------------- Fonctions non expos�es, usage interne ---------------*/


module.exports = {
  getRooms,
  getRoom,
  createRoom,
  joinRoom,  
  userRooms
};
