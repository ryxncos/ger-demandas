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

        // Verifica se o usuário está autenticado
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }

        const userId = req.user.id;
        
        console.log("Criando demanda para usuário ID:", userId);

        const records = await prisma.record.create({
            data: {
                title,
                description,
                type,
                imageUrl,
                user: {
                    connect: { id: userId }
                }
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
        
        return res.status(201).json({
            success: true,
            message: "Demanda criada com sucesso",
            data: records
        });
        
    } catch (error) {
        console.error("Erro detalhado:", error);
        return res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
}


async function deleteRecord(req, res) {
    try {
        const { id } = req.params; // Pega o ID da demanda da URL
        
        if (!id) {
            return res.status(400).json({ 
                success: false,
                error: "ID da demanda não fornecido" 
            });
        }

        // Verifica se o usuário está autenticado
        if (!req.user || !req.user.id) {
            return res.status(401).json({ 
                success: false,
                error: "Usuário não autenticado" 
            });
        }

        const userId = req.user.id;

        // Primeiro, verifica se a demanda existe e pertence ao usuário
        const existingRecord = await prisma.record.findFirst({
            where: {
                id: parseInt(id),
                userId: userId
            }
        });

        if (!existingRecord) {
            return res.status(404).json({ 
                success: false,
                error: "Demanda não encontrada ou não pertence a este usuário" 
            });
        }

        // Se for admin, pode deletar qualquer demanda (opcional)
        // if (req.user.role === 'ADMIN') {
        //     // Pula a verificação de propriedade
        // }

        // Deleta a demanda
        await prisma.record.delete({
            where: {
                id: parseInt(id)
            }
        });

        return res.status(200).json({
            success: true,
            message: "Demanda deletada com sucesso"
        });

    } catch (error) {
        console.error("Erro ao deletar demanda:", error);
        return res.status(500).json({ 
            success: false,
            error: error.message 
        });
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
async function getRecordById(req, res) {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: "ID da demanda não fornecido" });
        }

        const record = await prisma.record.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        user: true
                    }
                }
            }
        });

        if (!record) {
            return res.status(404).json({ error: "Demanda não encontrada" });
        }

        // Verifica se o usuário tem permissão (própria demanda ou admin)
        if (record.userId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "Você não tem permissão para ver esta demanda" });
        }

        return res.status(200).json(record);
    } catch (error) {
        console.error('Erro ao buscar demanda:', error);
        return res.status(500).json({ error: error.message });
    }
}
/**
 * PUT /records/:id - Atualiza uma demanda existente
 */
async function updateRecord(req, res) {
    try {
        const { id } = req.params;
        const { title, description, type } = req.body;
        
        // Validações básicas
        if (!id) {
            return res.status(400).json({ error: "ID da demanda não fornecido" });
        }

        if (!title && !description && !type && !req.file) {
            return res.status(400).json({ error: "Nenhum campo para atualizar foi fornecido" });
        }

        // Verifica se a demanda existe
        const existingRecord = await prisma.record.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingRecord) {
            return res.status(404).json({ error: "Demanda não encontrada" });
        }

        // Verifica permissão (apenas o dono ou admin pode editar)
        if (existingRecord.userId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "Você não tem permissão para editar esta demanda" });
        }

        // Prepara os dados para atualização
        const updateData = {};
        
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (type) updateData.type = type;
        if (req.file) updateData.imageUrl = req.file.filename;

        // Atualiza a demanda
        const updatedRecord = await prisma.record.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        user: true
                    }
                }
            }
        });

        return res.status(200).json({
            message: "Demanda atualizada com sucesso",
            record: updatedRecord
        });

    } catch (error) {
        console.error('Erro ao atualizar demanda:', error);
        return res.status(500).json({ error: error.message });
    }
}

/**
 * DELETE /records/:id - Remove uma demanda
 */
async function deleteRecord(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID da demanda não fornecido" });
        }

        // Verifica se a demanda existe
        const existingRecord = await prisma.record.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingRecord) {
            return res.status(404).json({ error: "Demanda não encontrada" });
        }

        // Verifica permissão (apenas o dono ou admin pode deletar)
        if (existingRecord.userId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "Você não tem permissão para deletar esta demanda" });
        }

        // Opcional: Deletar a imagem do arquivo se existir
        if (existingRecord.imageUrl) {
            const fs = require('fs');
            const path = require('path');
            const imagePath = path.join(__dirname, '..', 'uploads', existingRecord.imageUrl);
            
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log('Imagem deletada:', imagePath);
                }
            } catch (fileError) {
                console.error('Erro ao deletar arquivo de imagem:', fileError);
                // Continua mesmo se não conseguir deletar a imagem
            }
        }

        // Deleta a demanda
        await prisma.record.delete({
            where: { id: parseInt(id) }
        });

        return res.status(200).json({ 
            message: "Demanda deletada com sucesso",
            deletedId: parseInt(id)
        });

    } catch (error) {
        console.error('Erro ao deletar demanda:', error);
        return res.status(500).json({ error: error.message });
    }
}




module.exports = {
    createRecords,
    listUserRecords,
    listAllRecords,
    getRecordById,
    updateRecord,
    deleteRecord
};