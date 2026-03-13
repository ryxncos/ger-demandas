const express = require("express")
const router = express.Router();

const { loginUser } = require("../controllers/auth.controller");

router.post("/" ,loginUser);
module.exports = router;