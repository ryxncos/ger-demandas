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

        // Verifica se o usuário está no request (middleware de auth)
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }

        const userId = req.user.id;
        
        console.log("Criando demanda para usuário ID:", userId);

        // CORREÇÃO: Usa 'connect' para vincular ao usuário
        const records = await prisma.record.create({
            data: {
                title,
                description,
                type,
                imageUrl,
                user: {
                    connect: { id: userId }
                }
            }
        });

        
        
        return res.status(201).json(records);
        
    } catch (error) {
        console.error("Erro detalhado:", error);
        return res.status(500).json({ error: error.message });
    }
}

async function listUserRecords(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }

        const userId = req.user.id;
        
        const records = await prisma.record.findMany({
            where: {
                userId: userId  // Aqui pode usar userId direto (é diferente da criação)
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        user: true
                    }
                }
            }
        });

        return res.status(200).json(records);
    } catch (error) {
        console.error('Erro ao listar demandas:', error);
        return res.status(500).json({ error: error.message });
    }
}

async function listAllRecords(req, res) {
    try {
        // Verifica se é admin
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "Acesso negado" });
        }

        const records = await prisma.record.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        user: true
                    }
                }
            }
        });

        return res.status(200).json(records);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createRecords,
    listUserRecords,
    listAllRecords
};