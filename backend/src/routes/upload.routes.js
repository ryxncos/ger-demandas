const express = require("express");
const multer = require("../config/multer")
const UploadController = require("../controllers/UploadController")

const routes = express.Router()

routes.post(
    '/upload',
    imagem = multer.single('imagem'),
    UploadController.upload
)

module.exports = routes