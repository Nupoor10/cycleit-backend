const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { userLogin, userRegistration, getUserStats, getLeaderBoardStats } = require("../controllers/userController");

router.post("/login", userLogin);
router.post("/register", userRegistration);
router.get("/stats", authMiddleware, getUserStats);
router.get("/leaderboard", authMiddleware, getLeaderBoardStats);

module.exports = router;
