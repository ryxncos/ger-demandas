const prisma = require("../prisma/index.js")

async function createRecords(req, res) {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "Corpo da requisição não enviado" });
        }
        
        const { title, description, type } = req.body;
        
        if (!title || !description || !type) {
            return res.status(400).json({ 
                error: "Campos obrigatórios não preenchidos",
                received: req.body 
            });
        }
        
        const imageUrl = req.file ? req.file.filename : null;

        // Extrai o ID do usuário do token (que está em req.user)
        const userId = req.user.id; // ou req.userId dependendo de como você configurou
        
        console.log("Criando demanda para usuário ID:", userId); // Debug

        const records = await prisma.record.create({
            data: {
                title,
                description,
                type,
                imageUrl,
                userId: userId // Passa apenas o ID
            }
        });
        
        return res.status(201).json(records);
        
    } catch (error) {
        console.error("Erro detalhado:", error); // Log mais detalhado
        return res.status(500).json({ error: error.message });
    }
}
async function listRecords(req, res) {
  try {
    const records = await prisma.record.findMany({
      select: {
            title:true,
            description:true,
            type:true,
            imageUrl:true
      }
    });

    return res.json(records);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


module.exports = {createRecords, listRecords}