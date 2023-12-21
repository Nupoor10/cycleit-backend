const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllChallenges } = require("../controllers/challengeController");

const router = express.Router();

router.get("/all", authMiddleware, getAllChallenges);

module.exports = router;
