// backend/src/middlewares/auth.js
const jwt = require('jsonwebtoken');

async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: "Token não fornecido" });
        }

        // 🔥 Decodifica o token e extrai TODOS os dados (incluindo role)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_secret_jwt_aqui');
        
        // 🔥 IMPORTANTE: Adiciona o usuário COMPLETO (com role) na requisição
        req.user = {
            id: decoded.id,
            user: decoded.user,
            role: decoded.role  // 👈 GARANTA QUE O ROLE ESTÁ AQUI!
        };
        
        console.log('Usuário autenticado:', req.user); // Debug: veja se o role aparece
        
        next();
    } catch (error) {
        console.error('Erro na autenticação:', error);
        return res.status(403).json({ error: "Token inválido" });
    }
}

module.exports = { authenticate };