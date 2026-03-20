// backend/src/routes/records.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { 
    createRecords,
    listUserRecords,
    listAllRecords,
    getRecordById,
    updateRecord,
    deleteRecord
} = require('../controllers/records.controller');

const { authenticate } = require("../middlewares/auth.middleware");

// Configuração do Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, "C:/www/gerdemandas/backend/src/uploads") // pasta onde as imagens serão salvas
},
filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
}
});

const upload = multer({ storage: storage });

// Rotas protegidas (todas precisam de token)
router.post("/", upload.single('imageUrl'), authenticate, createRecords);
router.get("/", authenticate , listUserRecords)




router.get('/records/user', authenticate, listUserRecords); // Demandas do usuário
router.get('/records/all', authenticate, listAllRecords); // Todas (admin)
router.get('/records/all', authenticate, listAllRecords);
router.get('/records/:id', authenticate, getRecordById); // Busca específica
router.put('/records/:id', authenticate, upload.single('imageUrl'), updateRecord);
router.delete('/records/:id', authenticate, deleteRecord);
module.exports = router;