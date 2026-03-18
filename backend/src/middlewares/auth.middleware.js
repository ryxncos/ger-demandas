const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    
    next();

  } catch (error) {
    console.log("Vc chegou até aqui")
    return res.status(401).json({ message: "Token inválido ou expirado" });

  }
}

module.exports = { authenticate };  