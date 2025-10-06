const AnswerService = require('../services/AnswerService');
const logger = require('../utils/logger');

class AnswerController {
  constructor() {
    this.answerService = new AnswerService();
    this.saveAnswers = this.saveAnswers.bind(this);
    this.getUserAnswers = this.getUserAnswers.bind(this);
    this.saveSectionAnswers = this.saveSectionAnswers.bind(this);
  }

  async saveAnswers(req, res) {
    try {
      const { applicationId, answers } = req.body;
      const userId = req.userId;
      const result = await this.answerService.saveAnswers(userId, applicationId, answers);
      res.json(result);
    } catch (err) {
      logger.error('[ANSWER][SAVE] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to save answers' });
    }
  }

  async getUserAnswers(req, res) {
    try {
      const userId = req.userId;
      const { inspectionReportId } = req.query;
      const answers = await this.answerService.getUserAnswers(userId, inspectionReportId);
      res.json(answers);
    } catch (err) {
      logger.error('[ANSWER][GET] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to fetch answers' });
    }
  }

  async saveSectionAnswers(req, res) {
    try {
      const { inspectionReportId, sectionId, answers } = req.body;
      const userId = req.userId;
      const result = await this.answerService.saveSectionAnswers(userId, inspectionReportId, sectionId, answers);
      res.json(result);
    } catch (err) {
      logger.error('[ANSWER][SAVE_SECTION] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to save section answers' });
    }
  }
}

module.exports = AnswerController;
