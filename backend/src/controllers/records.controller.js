const prisma = require("../prisma/index.js")

async function createRecords(req, res) {
    try {
        // Verifica se req.body existe
        if (!req.body) {
            return res.status(400).json({ error: "Corpo da requisição não enviado" });
        }
        
        const { title, description, type } = req.body;
        
        // Verifica se os campos obrigatórios existem
        if (!title || !description || !type) {
            return res.status(400).json({ 
                error: "Campos obrigatórios não preenchidos",
                received: req.body 
            });
        }
        
        const imageUrl = req.file ? req.file.filename : null;
        
        const records = await prisma.record.create({
            data: {
                title,
                description,
                type,
                imageUrl,
                userId: 1
            }
        });
        
        return res.status(201).json(records);
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {createRecords}