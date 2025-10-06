const { Answer, Question, Section } = require('../models');

class DownloadRepo {
  async getUserAnswersWithDetails(userId) {
    return Answer.findAll({
      where: { userId },
      include: [
        { model: Question, include: [Section] }
      ]
    });
  }

  async getAnswersForInspectionReport(inspectionReportId) {
    return Answer.findAll({
      where: { inspectionReportId },
      include: [
        { model: Question, include: [Section] }
      ]
    });
  }
}

module.exports = DownloadRepo;
