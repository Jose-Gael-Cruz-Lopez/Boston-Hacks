const express = require('express');
const geminiParseController = require('../controllers/geminiParseController');

const router = express.Router();

// POST /api/gemini/parse
router.post('/parse', geminiParseController.parse);

module.exports = router;