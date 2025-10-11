const geminiParseService = require('../services/geminiParseService');

class GeminiParseController {
  async parse(req, res, next) {
    try {
      const { userInput, options = {} } = req.body || {};

      if (!userInput || typeof userInput !== 'string') {
        const err = new Error('userInput (string) is required');
        err.status = 400;
        throw err;
      }

      const result = await geminiParseService.generateInstructions(userInput, options);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GeminiParseController();

// req format:
// {
//   "userInput": "...",
//   "options": { ... }
// }

// res format:
// {
//   "instructions": [ "..." ],
//   "warnings": [ "..." ]
// }