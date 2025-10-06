const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/QuestionController');
const questionController = new QuestionController();
const AuthMiddleware = require('../middleware/AuthMiddleware');

router.get('/', AuthMiddleware.authenticate, async (req, res) => {
  try {
    await questionController.getQuestions(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
