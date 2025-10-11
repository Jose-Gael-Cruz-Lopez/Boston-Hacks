const debugService = require('../services/debugService');

class DebugController {
  async getDebugInfo(req, res, next) {
    try {
      const info = await debugService.getDebugInfo();
      res.json(info);
    } catch (error) {
      next(error);
    }
  }

  async echo(req, res, next) {
    try {
      const result = await debugService.echo(req.body, req.query, req.headers);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async logData(req, res, next) {
    try {
      const result = await debugService.logData(req.body, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getEnvInfo(req, res, next) {
    try {
      const envInfo = await debugService.getSafeEnvInfo();
      res.json(envInfo);
    } catch (error) {
      next(error);
    }
  }

  async testService(req, res, next) {
    try {
      const { serviceName, methodName, params } = req.body;
      const result = await debugService.testServiceFunction(serviceName, methodName, params);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async simulateError(req, res, next) {
    try {
      const { errorType = 'generic', message = 'Test error' } = req.body;
      await debugService.simulateError(errorType, message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DebugController();
