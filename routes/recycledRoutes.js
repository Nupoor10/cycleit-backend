const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { addRecycledItem, getAllRecycledItems, getRecycledItemByID, getRecycledItemsStats } = require("../controllers/recycledController");

router.post("/add", authMiddleware, addRecycledItem);
router.get("/all", authMiddleware, getAllRecycledItems);
router.get("/stats", authMiddleware, getRecycledItemsStats);
router.get("/:id", authMiddleware, getRecycledItemByID);

module.exports = router;
