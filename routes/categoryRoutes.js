const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllCategories } = require('../controllers/categoryController');

const router = express.Router();

router.get("/", authMiddleware, getAllCategories);

module.exports = router;
