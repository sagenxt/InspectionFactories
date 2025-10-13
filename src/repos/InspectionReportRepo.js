const { InspectionReport } = require('../models');
const { fn, col } = require('sequelize');

class InspectionReportRepo {
  async createInspectionReport({ userId, inspectionDate, factoryRegistrationNumber, factoryName, metadata }) {
    return InspectionReport.create({
      userId,
      inspectionDate,
      factoryRegistrationNumber,
      factoryName,
      metadata,
      status: 'draft'
    });
  }

  async getInspectionReportById(id) {
    return InspectionReport.findByPk(id);
  }

  async getInspectionReportByIdAndUser(id, userId) {
      return InspectionReport.findOne({ where: { id, userId } }).order([['createdAt', 'DESC']] );
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

  async getStatusSummaryByUser(userId) {
    return InspectionReport.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      where: { userId },
      group: ['status'],
    });
  }

  async getStatusSummary({ userId, role }) {
    const where = {};
    if (role === 'DISTRICT_OFFICER' && userId) {
      where.userId = userId;
    }
    // For ADMIN, no user filter
    return InspectionReport.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      where,
      group: ['status'],
    });
  }
}

module.exports = InspectionReportRepo;
