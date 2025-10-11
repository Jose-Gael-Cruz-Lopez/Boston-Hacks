const express = require('express');
const healthController = require('../controllers/healthController');

const router = express.Router();

// GET /api/health
router.get('/', healthController.getHealth);

// GET /api/health/detailed
router.get('/detailed', healthController.getDetailedHealth);

module.exports = router;
