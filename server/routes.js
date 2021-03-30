const express = require('express');
const router = require('./controllers/auth');
const authController = require('./controllers/auth')
const infoController = require('./controllers/getInfo').default

const routes = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/getMatchInfo", infoController.getInfo);

module.exports = router