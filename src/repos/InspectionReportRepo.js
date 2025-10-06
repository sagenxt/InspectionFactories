const { InspectionReport } = require('../models');

class InspectionReportRepo {
  async createInspectionReport(userId) {
    return InspectionReport.create({ userId, status: 'draft' });
  }

  async getInspectionReportById(id) {
    return InspectionReport.findByPk(id);
  }

  async getInspectionReportByIdAndUser(id, userId) {
      return InspectionReport.findOne({ where: { id, userId } });
  }

  async getActiveInspectionReports(userId) {
    return InspectionReport.findAll({ where: { userId } });
  }

  async getDraftInspectionReportByUser(userId) {
    return InspectionReport.findOne({ where: { userId, status: 'draft' } });
  }

  async setInspectionReportStatus(id, status) {
    return InspectionReport.update({ status }, { where: { id } });
  }
}

module.exports = InspectionReportRepo;

