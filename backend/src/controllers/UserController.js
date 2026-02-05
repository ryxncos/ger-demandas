const UserModel = require('../models/UserModel')

class UserController {
    async criar(req, res){
        try {
            const usuario = await UserModel.criarUsuario(req.body)
            return res.status(201).json(usuario)
        } catch (error) {
            return res.status(500).json({erro: 'Erro ao criar usuário'})
        }
    }
    async listar(req, res) {
        const usuarios = await UserModel.listarUsuarios()
        return res.json(usuarios)
    }
}

module.exports = new UserController()