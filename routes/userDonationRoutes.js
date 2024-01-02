const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const { getUserDonation, completeUserDonation ,createUserDonation } = require("../controllers/userDonationController");

const router = express.Router();

router.post("/add", authMiddleware, createUserDonation);
router.put("/complete/:id", authMiddleware, completeUserDonation);
router.get("/all", authMiddleware, getUserDonation);

module.exports = router;
