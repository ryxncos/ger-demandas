class UploadController {
    upload(req, res) {
        return res.status(200).json({
            mensagem: 'Upload realizado com sucesso',
            arquivo: req.file.filename,
            usuario: req.body.usuario
        })
    }
}

module.exports = new UploadController