const QuestionRepo = require('../repos/QuestionRepo');

class QuestionService {
  constructor() {
    this.questionRepo = new QuestionRepo();
  }

  async getQuestions({ formType, sectionId }) {
    return this.questionRepo.getQuestions({ formType, sectionId });
  }
}

module.exports = QuestionService;
