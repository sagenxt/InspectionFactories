const QuestionService = require('../services/QuestionService');
const logger = require('../utils/logger');

class QuestionController {
  constructor() {
    this.questionService = new QuestionService();
    this.getQuestions = this.getQuestions.bind(this);
  }

  async getQuestions(req, res) {
    try {
      const { formType, sectionId } = req.query;
      const questions = await this.questionService.getQuestions({ formType, sectionId });
      res.json(questions);
    } catch (err) {
      logger.error('[QUESTION][GET] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  }
}

module.exports = QuestionController;
