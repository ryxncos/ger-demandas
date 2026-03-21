// backend/src/controllers/auth.controller.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/index.js");

async function login(req, res) {
    try {
        const { user, password } = req.body;

        if (!user || !password) {
            return res.status(400).json({ error: "Usuário e senha são obrigatórios" });
        }

        // Busca o usuário no banco de dados
        const usuario = await prisma.user.findUnique({
            where: { user: user }
        });

        if (!usuario) {
            return res.status(401).json({ error: "Usuário ou senha inválidos" });
        }

        // Verifica a senha
        const senhaValida = await bcrypt.compare(password, usuario.password);

        if (!senhaValida) {
            return res.status(401).json({ error: "Usuário ou senha inválidos" });
        }

        // 🔥 IMPORTANTE: Incluir o role no token JWT
        const token = jwt.sign(
            { 
                id: usuario.id, 
                user: usuario.user, 
                role: usuario.role  // 👈 ADICIONE O ROLE AQUI!
            }, 
            process.env.JWT_SECRET || 'seu_secret_jwt_aqui',
            { expiresIn: '24h' }
        );

        // 🔥 IMPORTANTE: Retornar o role para o frontend
        return res.json({
            user: {
                id: usuario.id,
                user: usuario.user,
                role: usuario.role  // 👈 ADICIONE O ROLE NA RESPOSTA!
            },
            token
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { login };