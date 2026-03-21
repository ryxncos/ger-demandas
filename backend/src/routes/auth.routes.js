// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// 🔥 CORREÇÃO: Verifique se o controller está sendo importado corretamente
console.log('Auth controller:', authController); // Debug para ver o que está sendo importado

// Rota de login - Certifique-se que a função login existe
router.post('/', authController.login);
// ou se você usa router.post('/login', authController.login);

module.exports = router;