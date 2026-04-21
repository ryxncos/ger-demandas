// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


// console.log('Auth controller:', authController); 

// Rota de login -
router.post('/', authController.login);


module.exports = router;