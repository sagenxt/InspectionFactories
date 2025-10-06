const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/ApplicationController');
const applicationController = new ApplicationController();
const AuthMiddleware = require('../middleware/AuthMiddleware');

router.get('/statuses', AuthMiddleware.authenticate, (req, res) => applicationController.getStatuses(req, res));
router.post('/:applicationId/change-status', AuthMiddleware.authenticate, (req, res) => applicationController.changeStatus(req, res));
router.get('/:applicationId/status-history', AuthMiddleware.authenticate, (req, res) => applicationController.getStatusHistory(req, res));
router.post('/', AuthMiddleware.authenticate, (req, res) => applicationController.createApplication(req, res));
router.get('/details', AuthMiddleware.authenticate, (req, res) => applicationController.getApplicationDetails(req, res));
router.get('/status-summary', AuthMiddleware.authenticate, (req, res) => applicationController.getApplicationStatusSummary(req, res));
router.get('/by-status', AuthMiddleware.authenticate, (req, res) => applicationController.getApplicationsByStatus(req, res));

module.exports = router;
