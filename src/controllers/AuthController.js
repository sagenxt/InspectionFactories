const AuthService = require('../services/AuthService');
const logger = require('../utils/logger');

class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  async register(req, res) {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      logger.error('[AUTH][REGISTER] Error: %s', err.stack);
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const result = await this.authService.login(req.body);
      res.json(result);
    } catch (err) {
      logger.error('[AUTH][LOGIN] Error: %s', err.stack);
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = AuthController;
