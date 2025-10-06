const UserRepo = require('../repos/UserRepo');
const { encrypt, decrypt } = require('../utils/cryptoUtil');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor() {
    this.userRepo = new UserRepo();
  }

  async register({ name, email, password, role }) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error('Email already exists');
    const encryptedPassword = encrypt(password);
    const user = await this.userRepo.createUser({ name, email, passwordHash: encryptedPassword, role: role || 'user' });
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  async login({ email, password }) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const decryptedPassword = decrypt(user.passwordHash);
    if (decryptedPassword !== password) throw new Error('Invalid credentials');
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }
}

module.exports = AuthService;
