const bcrypt = require("bcrypt");
const prisma = require("../prisma/index.js");

// POST /users
async function createUser(req, res) {
  try {
    const { user, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const novoUsuario = await prisma.user.create({
      data: {
        user,
        password: hashedPassword,
        role
      }
    });

    return res.status(201).json(novoUsuario);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}




// GET /users
async function listUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        user: true,
        password: true,
        role: true
      }
    });

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createUser,
  listUsers
};
