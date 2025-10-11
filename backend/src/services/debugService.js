const logger = require('../utils/logger');

class DebugService {
  async getDebugInfo() {
    return {
      message: 'Debug endpoints available',
      endpoints: {
        echo: 'POST /api/debug/echo - Echo back request data',
        log: 'POST /api/debug/log - Log data to console',
        env: 'GET /api/debug/env - Show safe environment variables',
        'test-service': 'POST /api/debug/test-service - Test a service function',
        error: 'POST /api/debug/error - Simulate an error for testing'
      },
      timestamp: new Date().toISOString()
    };
  }

  async echo(body, query, headers) {
    return {
      message: 'Echo response',
      data: {
        body,
        query,
        headers: this.sanitizeHeaders(headers),
        timestamp: new Date().toISOString()
      }
    };
  }

  async logData(body, query) {
    const logData = {
      body,
      query,
      timestamp: new Date().toISOString()
    };

    logger.info('Debug log data:', JSON.stringify(logData, null, 2));
    
    return {
      message: 'Data logged to console',
      loggedData: logData
    };
  }

  async getSafeEnvInfo() {
    const safeEnvVars = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      NODE_VERSION: process.version,
      PLATFORM: process.platform,
      ARCH: process.arch
    };

    // Add any custom env vars that don't contain sensitive info
    const customVars = {};
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('DEBUG_') || key.startsWith('APP_')) {
        customVars[key] = process.env[key];
      }
    });

    return {
      safe: safeEnvVars,
      custom: customVars,
      timestamp: new Date().toISOString()
    };
  }

  async testServiceFunction(serviceName, methodName, params = {}) {
    try {
      logger.info(`Testing service: ${serviceName}.${methodName}`, params);
      
      // This is a placeholder - you can extend this to actually call services
      // For now, it just returns the parameters and logs the call
      
      return {
        message: `Service test called: ${serviceName}.${methodName}`,
        serviceName,
        methodName,
        params,
        result: 'Service test completed (placeholder)',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Service test error:', error);
      throw error;
    }
  }

  async simulateError(errorType, message) {
    logger.warn(`Simulating error: ${errorType} - ${message}`);
    
    switch (errorType) {
      case 'validation':
        throw new Error(`Validation Error: ${message}`);
      case 'notFound':
        const notFoundError = new Error(`Not Found: ${message}`);
        notFoundError.status = 404;
        throw notFoundError;
      case 'unauthorized':
        const authError = new Error(`Unauthorized: ${message}`);
        authError.status = 401;
        throw authError;
      case 'server':
        const serverError = new Error(`Server Error: ${message}`);
        serverError.status = 500;
        throw serverError;
      default:
        throw new Error(`Generic Error: ${message}`);
    }
  }

  sanitizeHeaders(headers) {
    const sanitized = { ...headers };
    
    // Remove sensitive headers
    delete sanitized.authorization;
    delete sanitized.cookie;
    delete sanitized['x-api-key'];
    
    return sanitized;
  }
}

module.exports = new DebugService();
