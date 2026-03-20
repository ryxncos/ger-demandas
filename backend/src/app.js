// backend/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: 'http://localhost:3005', // URL do seu frontend React
    credentials: true
}));

// 🔥 IMPORTANTE: Configurar a pasta de uploads como estática ANTES das rotas
// Caminho absoluto para a pasta uploads
const uploadsPath = path.join(__dirname, 'uploads');
console.log('📁 Pasta de uploads:', uploadsPath); // Debug

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(uploadsPath));

// Rotas
app.use("/users", require("./routes/user.routes"));
app.use("/login", require("./routes/auth.routes"));
app.use("/records", require("./routes/records.routes"));
app.use("/records/user", require("./routes/records.routes"))
// Rota de teste para verificar se a imagem está acessível
app.get('/test-uploads', (req, res) => {
    const fs = require('fs');
    fs.readdir(uploadsPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ 
            uploadsPath: uploadsPath,
            files: files,
            totalFiles: files.length 
        });
    });
});

module.exports = app;