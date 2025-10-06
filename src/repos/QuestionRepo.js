const { Question } = require('../models');

class QuestionRepo {
  async getQuestions({ formType, sectionId }) {
    const where = {};
    if (sectionId) where.sectionId = sectionId;
    return Question.findAll({ where });
  }
}

module.exports = QuestionRepo;
