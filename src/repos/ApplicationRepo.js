const { Application, ApplicationStatusHistory, Status } = require('../models');
const { Op } = require('sequelize');

class ApplicationRepo {
  async findByInspectionOrExternalId(inspectionReportId, externalId) {
    return Application.findOne({
      where: {
        [Op.or]: [
          { inspectionReportId },
          { externalId }
        ]
      }
    });
  }

  async createApplication(data) {
    return Application.create(data);
  }

  async updateStatus(applicationId, status) {
    return Application.update({ currentStatus: status }, { where: { id: applicationId } });
  }

  async createStatusHistory(applicationId, status, comment, userId) {
    return ApplicationStatusHistory.create({
      applicationId,
      status,
      comment,
      userId
    });
  }

  async getStatusHistory(applicationId) {
    return ApplicationStatusHistory.findAll({
      where: { applicationId },
      order: [['createdAt', 'DESC']]
    });
  }

  async findById(id) {
    return Application.findByPk(id);
  }

  async findByInspectionReportId(inspectionReportId) {
    return Application.findOne({ where: { inspectionReportId } });
  }

  async findByInspectionReportIdAndUserId(inspectionReportId, userId) {
    return Application.findOne({ where: { inspectionReportId, userId } });
  }

  async getApplicationStatusSummaryByUser(userId) {
    // Returns: [{ currentStatus: 'Show Cause Notice', count: 20 }, ...]
    const { Application } = require('../models');
    return Application.findAll({
      attributes: ['currentStatus', [Application.sequelize.fn('COUNT', Application.sequelize.col('id')), 'count']],
      where: { userId },
      group: ['currentStatus']
    });
  }

  async getApplicationsByStatusAndUser(status, userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const where = { userId };
    if (status) {
      where.currentStatus = status;
    }
    const { count, rows } = await Application.findAndCountAll({
      where,
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });
    return {
      data: rows,
      total: count,
      page,
      limit
    };
  }

  async getStatusSummaryByUser(userId) {
    const { Application } = require('../models');
    const { fn, col } = require('sequelize');
    return Application.findAll({
      attributes: ['currentStatus', [fn('COUNT', col('id')), 'count']],
      where: { userId },
      group: ['currentStatus'],
    });
  }

  async getStatusSummary({ userId, role }) {
    const { Application } = require('../models');
    const { fn, col } = require('sequelize');
    const where = {};
    if (role === 'DISTRICT_OFFICER' && userId) {
      where.userId = userId;
    }
    // For ADMIN, no user filter
    return Application.findAll({
      attributes: ['currentStatus', [fn('COUNT', col('id')), 'count']],
      where,
      group: ['currentStatus'],
    });
  }
}

module.exports = new ApplicationRepo();
