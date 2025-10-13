const express = require('express');
const router = express.Router();
const InspectionReportController = require('../controllers/InspectionReportController');
const inspectionReportController = new InspectionReportController();
const AuthMiddleware = require('../middleware/AuthMiddleware');

router.post('/start', AuthMiddleware.authenticate, (req, res) => inspectionReportController.startInspectionReport(req, res));
router.post('/complete', AuthMiddleware.authenticate, (req, res) => inspectionReportController.completeInspectionReport(req, res));
router.get('/', AuthMiddleware.authenticate, (req, res) => inspectionReportController.getInspectionReport(req, res));
router.get('/active', AuthMiddleware.authenticate, (req, res) => inspectionReportController.getActiveInspectionReports(req, res));
router.post('/submit', AuthMiddleware.authenticate, (req, res) => inspectionReportController.submitInspectionReport(req, res));
router.get('/status-summary', AuthMiddleware.authenticate, (req, res) => inspectionReportController.getInspectionReportStatusSummary(req, res));
router.post('/', AuthMiddleware.authenticate, (req, res) => inspectionReportController.createInspectionReport(req, res));

module.exports = router;
