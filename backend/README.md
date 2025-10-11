# Backend Debug Server

A basic Node.js/Express backend server designed for debugging services, functions, and controllers.

## Features

- **Health Monitoring**: Basic and detailed health check endpoints
- **Debug Tools**: Comprehensive debugging endpoints for testing
- **Error Handling**: Centralized error handling with logging
- **Logging**: Structured logging with different levels
- **CORS Support**: Configurable CORS for frontend integration
- **Security**: Helmet for security headers

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

3. Test the server:
```bash
curl http://localhost:4000/health
```

## API Endpoints

### Health Check
- `GET /health` - Basic health status
- `GET /api/health` - Basic health status (API version)
- `GET /api/health/detailed` - Detailed system information

### Debug Endpoints
- `GET /api/debug` - List all debug endpoints
- `POST /api/debug/echo` - Echo back request data
- `POST /api/debug/log` - Log data to console
- `GET /api/debug/env` - Show safe environment variables
- `POST /api/debug/test-service` - Test service functions
- `POST /api/debug/error` - Simulate errors for testing

## Project Structure

```
backend/
├── index.js                 # Main server entry point
├── package.json            # Dependencies and scripts
├── config.example.js       # Configuration template
├── README.md              # This file
└── src/
    ├── routes/            # Route definitions
    │   ├── index.js       # Main router
    │   ├── health.routes.js
    │   └── debug.routes.js
    ├── controllers/       # Request handlers
    │   ├── healthController.js
    │   └── debugController.js
    ├── services/          # Business logic
    │   ├── healthService.js
    │   └── debugService.js
    ├── middleware/        # Express middleware
    │   ├── errorHandler.js
    │   └── notFound.js
    └── utils/            # Utility functions
        └── logger.js
```

## Adding New Features

### 1. Create a Service
```javascript
// src/services/myService.js
class MyService {
  async myFunction(params) {
    // Your business logic here
    return { result: 'success', data: params };
  }
}

module.exports = new MyService();
```

### 2. Create a Controller
```javascript
// src/controllers/myController.js
const myService = require('../services/myService');

class MyController {
  async myEndpoint(req, res, next) {
    try {
      const result = await myService.myFunction(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MyController();
```

### 3. Create Routes
```javascript
// src/routes/my.routes.js
const express = require('express');
const myController = require('../controllers/myController');

const router = express.Router();
router.post('/my-endpoint', myController.myEndpoint);

module.exports = router;
```

### 4. Register Routes
```javascript
// src/routes/index.js
const myRoutes = require('./my.routes');
router.use('/my', myRoutes);
```

## Debugging Tools

### Test Service Functions
```bash
curl -X POST http://localhost:4000/api/debug/test-service \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "myService",
    "methodName": "myFunction",
    "params": {"test": "data"}
  }'
```

### Echo Request Data
```bash
curl -X POST http://localhost:4000/api/debug/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "test data"}'
```

### Simulate Errors
```bash
curl -X POST http://localhost:4000/api/debug/error \
  -H "Content-Type: application/json" \
  -d '{"errorType": "validation", "message": "Test validation error"}'
```

## Environment Variables

Create a `.env` file based on `config.example.js`:

```bash
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DEBUG_LEVEL=info
DEBUG_SERVICES=true
```

## Logging

The server includes structured logging with different levels:
- `info` - General information
- `warn` - Warnings
- `error` - Errors
- `debug` - Debug information (development only)

Logs include timestamps, request details, and structured data.

## Error Handling

All errors are caught and handled centrally with:
- Proper HTTP status codes
- Structured error responses
- Stack traces in development
- Request logging for debugging
