const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllBadges } = require("../controllers/badgeController");

const router = express.Router();

router.get("/all", authMiddleware, getAllBadges);

module.exports = router;
