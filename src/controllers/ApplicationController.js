const ApplicationService = require('../services/ApplicationService');
const logger = require('../utils/logger');

class ApplicationController {
  constructor() {
    this.applicationService = new ApplicationService();
    this.getStatuses = this.getStatuses.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.getStatusHistory = this.getStatusHistory.bind(this);
    this.createApplication = this.createApplication.bind(this);
    this.getApplicationDetails = this.getApplicationDetails.bind(this);
    this.getApplicationStatusSummary = this.getApplicationStatusSummary.bind(this);
    this.getApplicationsByStatus = this.getApplicationsByStatus.bind(this);
  }

  async getStatuses(req, res) {
    try {
      const statuses = await this.applicationService.getStatuses();
      res.json(statuses);
    } catch (err) {
      logger.error('[APPLICATION][GET_STATUSES] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to fetch statuses' });
    }
  }

  async changeStatus(req, res) {
    try {
      const { applicationId } = req.params;
      const { status, comment } = req.body;
      const userId = req.userId;
      // Ownership check
      const app = await this.applicationService.getApplicationDetails({ id: applicationId });
      if (!app || app.userId !== userId) {
        return res.status(403).json({ error: 'You do not have permission to update this application' });
      }
      const result = await this.applicationService.changeStatus(applicationId, status, comment, userId);
      res.json(result);
    } catch (err) {
      logger.error('[APPLICATION][CHANGE_STATUS] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to change status' });
    }
  }

  async getStatusHistory(req, res) {
    try {
      const { applicationId } = req.params;
      const history = await this.applicationService.getStatusHistory(applicationId);
      res.json(history);
    } catch (err) {
      logger.error('[APPLICATION][GET_STATUS_HISTORY] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to fetch status history' });
    }
  }

  async createApplication(req, res) {
    try {
      const { inspectionReportId, externalId } = req.body;
      const userId = req.userId;
      if (!inspectionReportId || !externalId) {
        return res.status(400).json({ error: 'inspectionReportId and externalId are required' });
      }
      const app = await this.applicationService.createApplication(inspectionReportId, externalId, userId);
      res.status(201).json(app);
    } catch (err) {
      if (err.message && (err.message.includes('already exists') || err.message.includes("not found"))) {
        res.status(400).json({ error: err.message });
      }
      else {
        logger.error('[APPLICATION][CREATE] Error: %s', err.stack);
        res.status(500).json({ error: 'Failed to create application' });
      }
    }
  }

  async getApplicationDetails(req, res) {
    try {
      const { applicationId, inspectionReportId } = req.query;
      if (!applicationId && !inspectionReportId) {
        return res.status(400).json({ error: 'applicationId or inspectionReportId required' });
      }
      const details = await this.applicationService.getApplicationDetails({ id: applicationId, inspectionReportId });
      res.json(details);
    } catch (err) {
      if (err.message && err.message.includes('not found')) {
        res.status(404).json({ error: err.message });
      } else {
        logger.error('[APPLICATION][DETAILS] Error: %s', err.stack);
        res.status(500).json({ error: 'Failed to fetch application details' });
      }
    }
  }

  async getApplicationStatusSummary(req, res) {
    try {
      const userId = req.userId;
      const role = req.userRole;
      const summary = await this.applicationService.getApplicationStatusSummary(userId, role);
      res.json(summary);
    } catch (err) {
      logger.error('[APPLICATION][STATUS_SUMMARY] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to fetch application status summary' });
    }
  }

  async getApplicationsByStatus(req, res) {
    try {
      const userId = req.userId;
      const { status } = req.query;
      if (!status) {
        return res.status(400).json({ error: 'status is required' });
      }
      const applications = await this.applicationService.getApplicationsByStatusAndUser(status, userId);
      res.json(applications);
    } catch (err) {
      logger.error('[APPLICATION][BY_STATUS] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to fetch applications by status' });
    }
  }

}

module.exports = ApplicationController;
