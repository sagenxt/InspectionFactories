const AnswerRepo = require('../repos/AnswerRepo');

class AnswerService {
  constructor() {
    this.answerRepo = new AnswerRepo();
  }

  async saveAnswers(userId, inspectionReportId, answers) {
    for (const ans of answers) {
      await this.answerRepo.upsertAnswer({
        userId,
        questionId: ans.questionId,
        inspectionReportId,
        value: ans.value, // 'Yes', 'No', 'NA'
        notes: ans.notes
      });
    }
    return { success: true };
  }

  async getUserAnswers(userId, inspectionReportId) {
    return this.answerRepo.getAnswersByUser(userId, inspectionReportId);
  }

  async saveSectionAnswers(userId, inspectionReportId, sectionId, answers) {
    // Each answer must have questionId, value, notes
    for (const ans of answers) {
      await this.answerRepo.upsertAnswer({
        userId,
        questionId: ans.questionId,
        inspectionReportId,
        value: ans.value,
        notes: ans.notes
      });
    }
    return { success: true };
  }
}

module.exports = AnswerService;
