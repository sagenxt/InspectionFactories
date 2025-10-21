const AnswerRepo = require('../repos/AnswerRepo');
const inspectionReportRepo = require('../repos/InspectionReportRepo');

class AnswerService {
  constructor() {
    this.answerRepo = new AnswerRepo();
    this.inspectionReportRepo = new inspectionReportRepo();
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
    await this.inspectionReportRepo.setInspectionReportStatus(inspectionReportId, "draft");

    return { success: true };
  }
}

module.exports = AnswerService;
