const express = require('express');
const healthRoutes = require('./health.routes');
const debugRoutes = require('./debug.routes');
const geminiRoutes = require('./gemini.routes');

const router = express.Router();

// Mount route modules
router.use('/health', healthRoutes);
router.use('/debug', debugRoutes);
router.use('/gemini', geminiRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Backend API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      debug: '/api/debug',
      gemini: '/api/gemini'
    }
  });
});

module.exports = router;
