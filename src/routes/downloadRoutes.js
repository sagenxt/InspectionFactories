const express = require('express');
const router = express.Router();
const DownloadController = require('../controllers/DownloadController');
const downloadController = new DownloadController();
const AuthMiddleware = require('../middleware/AuthMiddleware');

router.get('/', AuthMiddleware.authenticate, async (req, res) => {
  try {
    await downloadController.downloadAnswers(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/inspection-report/:inspectionReportId', AuthMiddleware.authenticate, async (req, res) => {
  try {
    await downloadController.downloadInspectionReportPdf(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
