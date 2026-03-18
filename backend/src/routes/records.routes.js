const express = require("express");
const multer = require('multer');
const path = require('path');
const router = express.Router();


const { authenticate } = require("../middlewares/auth.middleware");
const { createRecords, listRecords } = require("../controllers/records.controller");
// const { lisRecords} = require



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

// Na sua rota, use o multer primeiro
// router.post("/", authenticate, createRecords);
router.post("/", upload.single('imageUrl'), authenticate, createRecords);
router.get("/", authenticate , listRecords)



module.exports = router;