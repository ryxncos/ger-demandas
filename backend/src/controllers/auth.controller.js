const bcrypt = require("bcrypt");
const prisma = require("../prisma/index.js")


async function loginUser(req, res) {
  try {
    const { user, password } = req.body;
    
    // Buscar usuário no banco
    const usuario = await prisma.user.findUnique({
      where: { user: user }
    });
    
    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }
    
    // Validar senha
    const senhaValida = await bcrypt.compare(password, usuario.password);
    
    if (!senhaValida) {
      return res.status(401).json({ error: "Senha inválida" });
    }
    
    // Login bem-sucedido
    return res.status(200).json({
      message: "Login realizado com sucesso",
      user: {
        id: usuario.id,
        user: usuario.name,
        role: usuario.role
      }
    });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Exportação CORRETA para CommonJS
module.exports = {
  loginUser
};