const express = require('express')
const UserController = require('../controllers/UserController')

const routes = express.Router()

routes.post('/usuarios', UserController.criar)
routes.get('/usuarios', UserController.listar)

module.exports = routes