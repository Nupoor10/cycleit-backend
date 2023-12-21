const express = require('express');
const { userLogin, userRegistration } = require("../controllers/userController");

const router = express.Router();

router.post("/login", userLogin);
router.post("/register", userRegistration);

module.exports = router;
