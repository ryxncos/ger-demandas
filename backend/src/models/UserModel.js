const pool = require('../config/db')

class UserModel {
    async criarUsuario({usuario, senha, role}) {
        const query = `
            INSERT INTO usuarios (usuario, senha, role)
            VALUES ($1, $2, $3)
            RETURNING id, usuario, senha, role
        `
        const values = [usuario, senha, role || 'admin']

        const { rows } = await pool.query(query, values)
        return rows[0]

    }

    async listarUsuarios(){
        const { rows } = await pool.query(
            'SELECT id, usuario, senha, role FROM usuarios'
        )
        return rows
    }
}

module.exports = new UserModel()