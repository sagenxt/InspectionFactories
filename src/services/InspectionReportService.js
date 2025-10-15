const InspectionReportRepo = require('../repos/InspectionReportRepo');
const Section = require('../models').Section;
const Question = require('../models').Question;
const Answer = require('../models').Answer;

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

  async getActiveInspectionReports(userId, page = 1, limit = 10) {
    return this.inspectionReportRepo.getActiveInspectionReports(userId, page, limit);
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

      if (section.formType === 'A' && missingQuestions.length > 0) {
        // Section A is mandatory
        missing.push({ section: section.name, questions: missingQuestions.map(q => q.id) });
      } else if (section.name === 'B') {
        // Section B: If any question is answered, all must be answered
        const answeredInSectionB = sectionQuestions.some(q => answeredIds.has(q.id));
        if (answeredInSectionB && missingQuestions.length > 0) {
          missing.push({ section: section.name, questions: missingQuestions.map(q => q.id) });
        }
      } else if (missingQuestions.length > 0) {
        // General case for other sections
        missing.push({ section: section.name, questions: missingQuestions.map(q => q.id) });
      }
    }

    if (missing.length > 0) {
      return { success: false, missing };
    }

    await this.inspectionReportRepo.setInspectionReportStatus(inspectionReportId, 'complete');
    return { success: true };
  }

  async getInspectionReportStatusSummary(userId, role) {
    const statusSummary = await this.inspectionReportRepo.getStatusSummary({ userId, role });
    const totalCount = await this.inspectionReportRepo.getTotalCount({ userId, role });
    const monthlyCount = await this.inspectionReportRepo.getMonthlyCount({ userId, role });
    return { statusSummary, totalCount, monthlyCount };
  }

  async createInspectionReport({ userId, inspectionDate, factoryRegistrationNumber, factoryName, metadata }) {
    return this.inspectionReportRepo.createInspectionReport({
      userId,
      inspectionDate,
      factoryRegistrationNumber,
      factoryName,
      metadata
    });
  }

  async getInspectionReportsByStatus(status, userId, role, page, limit) {
    if(status != null){
        const validStatuses = ['draft', 'in_progress', 'complete'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status value');
        }
    }
    return this.inspectionReportRepo.getByStatus(status, userId, role, page, limit);
  }
}

module.exports = InspectionReportService;
