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

  async getTotalCount({ userId, role }) {
    const where = {};
    if (role === 'DISTRICT_OFFICER' && userId) {
      where.userId = userId;
    }
    return InspectionReport.count({ where });
  }

  async getMonthlyCount({ userId, role }) {
    const where = {};
    if (role === 'DISTRICT_OFFICER' && userId) {
      where.userId = userId;
    }
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const { Op } = require('sequelize');
    where.createdAt = { [Op.gte]: startOfMonth, [Op.lte]: endOfMonth };
    return InspectionReport.count({ where });
  }
}

module.exports = InspectionReportRepo;
