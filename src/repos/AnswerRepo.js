const { Answer, Question } = require('../models');

class AnswerRepo {
  async upsertAnswer({ userId, questionId, inspectionReportId, value, notes }) {
    return Answer.upsert({ userId, questionId, inspectionReportId, value, notes });
  }

  async getAnswersByUser(userId, inspectionReportId) {
    const where = { userId };
    if (inspectionReportId) where.inspectionReportId = inspectionReportId;
    return Answer.findAll({
      where,
      include: [{ model: Question }]
    });
  }
}

module.exports = AnswerRepo;
