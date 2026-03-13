const prisma = require("../prisma/index.js")

async function createRecords(req,res) {
    try {

        // const { title, description, type} = req.body;
        const imageUrl = req.file ? req.file.filename : null;

        const records = await prisma.record.create({
            
            data:{
                title,
                description,
                type,
                imageUrl,
                userId: req.userId

            }
        });
        return res.status(201).json(records)
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

module.exports = {createRecords}