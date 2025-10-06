const { User } = require('../models');

class UserRepo {
  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  async createUser({ name, email, passwordHash }) {
    return User.create({ name, email, passwordHash });
  }

  async findById(id) {
    return User.findByPk(id);
  }
}

module.exports = UserRepo;

