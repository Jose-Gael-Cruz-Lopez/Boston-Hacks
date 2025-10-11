const express = require('express');
const debugController = require('../controllers/debugController');

const router = express.Router();

// GET /api/debug - List available debug endpoints
router.get('/', debugController.getDebugInfo);

// POST /api/debug/echo - Echo back request data
router.post('/echo', debugController.echo);

// POST /api/debug/log - Log data to console
router.post('/log', debugController.logData);

// GET /api/debug/env - Show environment variables (safe)
router.get('/env', debugController.getEnvInfo);

// POST /api/debug/test-service - Test a service function
router.post('/test-service', debugController.testService);

// POST /api/debug/error - Simulate an error for testing
router.post('/error', debugController.simulateError);

module.exports = router;
