const InspectionReportService = require('../services/InspectionReportService');
const logger = require('../utils/logger');

class InspectionReportController {
  constructor() {
    this.inspectionReportService = new InspectionReportService();
  }

  async startInspectionReport(req, res) {
    try {
      const userId = req.userId;
      const report = await this.inspectionReportService.startInspectionReport(userId);
      res.json(report);
    } catch (err) {
      logger.error('[INSPECTION_REPORT][START] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to start inspection report' });
    }
  }

  async completeInspectionReport(req, res) {
    try {
      const { inspectionReportId } = req.body;
      await this.inspectionReportService.completeInspectionReport(inspectionReportId);
      res.json({ success: true });
    } catch (err) {
      logger.error('[INSPECTION_REPORT][COMPLETE] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to complete inspection report' });
    }
  }

  async getInspectionReport(req, res) {
    try {
      const userId = req.userId;
      const { inspectionReportId } = req.query;
      const report = await this.inspectionReportService.getInspectionReport(inspectionReportId, userId);
      res.json(report);
    } catch (err) {
      logger.error('[INSPECTION_REPORT][GET] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to get inspection report' });
    }
  }

  async getActiveInspectionReports(req, res) {
    try {
      const userId = req.userId;
      const reports = await this.inspectionReportService.getActiveInspectionReports(userId);
      res.json(reports);
    } catch (err) {
      logger.error('[INSPECTION_REPORT][ACTIVE] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to get active inspection reports' });
    }
  }

  async submitInspectionReport(req, res) {
    try {
      const userId = req.userId;
      const { inspectionReportId } = req.body;
      const result = await this.inspectionReportService.submitInspectionReport(userId, inspectionReportId);
      if (result.success) {
        res.json({ success: true });
      } else {
        res.status(400).json({ missing: result.missing});
      }
    } catch (err) {
      logger.error('[INSPECTION_REPORT][SUBMIT] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to submit inspection report' });
    }
  }
}

module.exports = InspectionReportController;

