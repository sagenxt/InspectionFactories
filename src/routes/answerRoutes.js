const express = require('express');
const router = express.Router();
const AnswerController = require('../controllers/AnswerController');
const answerController = new AnswerController();
const AuthMiddleware = require('../middleware/AuthMiddleware');

router.post('/', AuthMiddleware.authenticate, answerController.saveAnswers);
router.get('/', AuthMiddleware.authenticate, answerController.getUserAnswers);
router.post('/section', AuthMiddleware.authenticate, answerController.saveSectionAnswers);

module.exports = router;
