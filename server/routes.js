const express = require('express');
const router = require('./controllers/auth');
const authController = require('./controllers/auth')

const routes = express.Router();

router.post("/register", authController.register)
router.post("/login", authController.login);

module.exports = router