const DownloadService = require('../services/DownloadService');
const logger = require('../utils/logger');

class DownloadController {
  constructor() {
    this.downloadService = new DownloadService();
    this.downloadAnswers = this.downloadAnswers.bind(this);
    this.downloadInspectionReportPdf = this.downloadInspectionReportPdf.bind(this);
  }

  async downloadAnswers(req, res) {
    try {
      const userId = req.userId;
      const csv = await this.downloadService.getAnswersCsv(userId);
      res.header('Content-Type', 'text/csv');
      res.attachment('answers.csv');
      res.send(csv);
    } catch (err) {
      logger.error('[DOWNLOAD][GET] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to download answers' });
    }
  }

  async downloadInspectionReportPdf(req, res) {
    try {
      const { inspectionReportId } = req.params;
      const doc = await this.downloadService.generateInspectionReportPdf(inspectionReportId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=inspection_report.pdf');
      doc.pipe(res);
    } catch (err) {
      logger.error('[DOWNLOAD][PDF] Error: %s', err.stack);
      res.status(500).json({ error: 'Failed to download inspection report PDF' });
    }
  }
}

module.exports = DownloadController;
