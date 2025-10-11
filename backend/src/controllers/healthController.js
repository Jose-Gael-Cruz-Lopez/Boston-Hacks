const healthService = require('../services/healthService');

class HealthController {
  async getHealth(req, res, next) {
    try {
      const health = await healthService.getBasicHealth();
      res.json(health);
    } catch (error) {
      next(error);
    }
  }

  async getDetailedHealth(req, res, next) {
    try {
      const health = await healthService.getDetailedHealth();
      res.json(health);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HealthController();
