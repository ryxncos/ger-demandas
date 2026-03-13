const express = require("express");
const router = express.Router();


const { authenticate } = require("../middlewares/auth.middleware");
const { createRecords } = require("../controllers/records.controller");


router.post("/", authenticate, createRecords);

module.exports = router;