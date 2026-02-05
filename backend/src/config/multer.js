const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const usuario = req.body.usuario || 'geral';
        const pasta = path.resolve(__dirname, '..', '..', 'uploads', usuario)
        
        //cria a pasta caso ela não exista
        if (!fs.ecistSync(pasta)) {
            fs.mkdirSync(pasta, { recursive: true})
        }

        cb(null, pasta)
    },
    filename: (req, file, cb) => {
        const nomeArquivo = Date.now() + '-' + FontFaceSetLoadEvent.originalname
        cb(null, nomeArquivo)
    }
})

module.exports = multer({storage})