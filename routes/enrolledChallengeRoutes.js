const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { enrollChallenge, getUserChallenges, completeChallenge, unenrollChallenge } = require("../controllers/enrolledChallengeController");

const router = express.Router();

router.post("/add", authMiddleware, enrollChallenge);
router.get("/all", authMiddleware, getUserChallenges);
router.put("/update/:id", authMiddleware, completeChallenge);
router.delete("/:id", authMiddleware, unenrollChallenge);

module.exports = router;
