const express = require('express')
const connectionRouter = express.Router()
const connectionController = require('../Controllers/connectionController')

connectionRouter.route('/')
  .get(connectionController.getAllconnections)

connectionRouter.route('/:idConnection')
  .get(connectionController.getconnection)

module.exports = connectionRouter;
