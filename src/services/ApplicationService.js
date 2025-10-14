const ApplicationRepo = require('../repos/ApplicationRepo');
const InspectionReportRepo = require('../repos/InspectionReportRepo');
const { Status } = require('../models');

class ApplicationService {

  constructor() {
    this.inspectionReportRepo = new InspectionReportRepo();
  }
  async getStatuses() {
    return Status.findAll();
  }

  async changeStatus(applicationId, status, comment, userId) {
    await ApplicationRepo.updateStatus(applicationId, status);
    await ApplicationRepo.createStatusHistory(applicationId, status, comment, userId);
    return { success: true };
  }

  async getStatusHistory(applicationId) {
    return ApplicationRepo.getStatusHistory(applicationId);
  }

  async createApplication(inspectionReportId, externalId, userId) {

    const inspectionReport = await this.inspectionReportRepo.getInspectionReportByIdAndUser(inspectionReportId, userId);
    if(!inspectionReport || inspectionReport.applicationNumber !== null) {
        throw new Error('Inspection Report not found or does not belong to the user');
    }
    // Check if any application exists for this inspectionReportId and userId
    const existingByUser = await ApplicationRepo.findByInspectionReportIdAndUserId(inspectionReportId, userId);
    if (existingByUser) {
      throw new Error('An application for this inspectionReportId already exists for this user');
    }
    // Check for global uniqueness of inspectionReportId or externalId
    const existing = await ApplicationRepo.findByInspectionOrExternalId(inspectionReportId, externalId);
    if (existing) {
      throw new Error('Application with this inspectionReportId or externalId already exists');
    }
    const app = await ApplicationRepo.createApplication({
      inspectionReportId,
      externalId,
      currentStatus: 'Show Cause Notice',
      userId
    });
    await ApplicationRepo.createStatusHistory(app.id, 'Show Cause Notice', 'Application created', userId);
    await this.inspectionReportRepo.setInspectionApplicationNumber(inspectionReportId, 'under_review');
    return app;
  }

  async getApplicationDetails({ id, inspectionReportId }) {
    let app;
    if (id) {
      app = await ApplicationRepo.findById(id);
    } else if (inspectionReportId) {
      app = await ApplicationRepo.findByInspectionReportId(inspectionReportId);
    }
    if (!app) throw new Error('Application not found');
    const statusHistory = await ApplicationRepo.getStatusHistory(app.id);
    return { ...app.toJSON(), statusHistory };
  }

  async getApplicationStatusSummaryByUser(userId) {
    const summary = await ApplicationRepo.getApplicationStatusSummaryByUser(userId);
    // Format as { status: count }
    const result = {};
    summary.forEach(item => {
      result[item.currentStatus] = parseInt(item.dataValues.count, 10);
    });
    return result;
  }

  async getApplicationsByStatusAndUser(status, userId, page = 1, limit = 10) {
    return ApplicationRepo.getApplicationsByStatusAndUser(status, userId, page, limit);
  }

  async getApplicationStatusSummary(userId, role) {
    return ApplicationRepo.getStatusSummary({ userId, role });
  }
}

module.exports = ApplicationService;
