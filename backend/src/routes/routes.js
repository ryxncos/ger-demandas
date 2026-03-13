const express = require('express');
const router = express.Router();
const { healthCheck } = require('../controllers/controller.js');

router.get('/', healthCheck);

module.exports = router;