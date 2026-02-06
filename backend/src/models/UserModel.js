const pool = require('../config/db')

class UserModel {
    async criarUsuario({usuarios, senha, role}) {
        const query = `
            INSERT INTO usuarios (usuarios, senha, role)
            VALUES ($1, $2, $3)
            RETURNING id, usuarios, senha, role
        `
        const values = [usuarios, senha, role || 'admin']

        const { rows } = await pool.query(query, values)
        return rows[0]

    }

    async listarUsuarios(){
        const { rows } = await pool.query(
            'SELECT id, usuarios, senha, role FROM usuarios'
        )
        return rows
    }
}

module.exports = new UserModel()