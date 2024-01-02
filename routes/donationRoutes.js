const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const { createDonationCampaign, updateDonationCampaign, getDonationCampaign, getUserDonationCampaign , getDonationCampaignById } = require("../controllers/donationController")

const router = express.Router();

router.post("/add", authMiddleware, createDonationCampaign);
router.put("/update/:id", authMiddleware, updateDonationCampaign);
router.get("/all", authMiddleware, getDonationCampaign); 
router.get("/created", authMiddleware, getUserDonationCampaign); 
router.get("/:id", authMiddleware, getDonationCampaignById); 

module.exports = router;
