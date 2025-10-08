const InspectionReportRepo = require('../repos/InspectionReportRepo');
const { Section, Question, Answer } = require('../models');

class InspectionReportService {
  constructor() {
    this.inspectionReportRepo = new InspectionReportRepo();
  }

  async startInspectionReport(userId) {
    return  await this.inspectionReportRepo.createInspectionReport(userId);
  }

  async completeInspectionReport(id) {
    return this.inspectionReportRepo.setInspectionReportStatus(id, 'complete');
  }

  async getInspectionReport(id, userId) {
    return this.inspectionReportRepo.getInspectionReportByIdAndUser(id, userId);
  }

  async getActiveInspectionReports(userId) {
    const report = await this.inspectionReportRepo.getActiveInspectionReports(userId);
    if (!report) return [];
    return report;
  }

  async submitInspectionReport(userId, inspectionReportId) {
    const sections = await Section.findAll();
    const questions = await Question.findAll();
    const answers = await Answer.findAll({ where: { inspectionReportId } });
    const answeredIds = new Set(answers.map(a => a.questionId));
    const missing = [];
    for (const section of sections) {
      const sectionQuestions = questions.filter(q => q.sectionId === section.id);
      const missingQuestions = sectionQuestions.filter(q => !answeredIds.has(q.id));
      if (missingQuestions.length > 0) {
        missing.push({ section: section.name, questions: missingQuestions.map(q => q.id) });
      }
    }
    if (missing.length > 0) {
      return { success: false, missing };
    }
    await this.inspectionReportRepo.setInspectionReportStatus(inspectionReportId, 'complete');
    return { success: true };
  }
}

module.exports = InspectionReportService;

