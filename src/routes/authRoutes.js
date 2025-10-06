const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authController = new AuthController();

router.post('/register', async (req, res) => {
  try {
    await authController.register(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    await authController.login(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
