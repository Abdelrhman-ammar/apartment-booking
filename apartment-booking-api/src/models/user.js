import { hashPassword, comparePassword } from '../utils/hash.js';

export default class User {
  constructor({ name, email, password, role = 'USER' }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static validate({ name, email, password, role }) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validRoles = ['USER', 'ADMIN', 'OWNER'];

    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    if (role && !validRoles.includes(role)) {
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }
  }

  async hashPassword() {
    this.password = await hashPassword(this.password);
  }

  toObject() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
    };
  }

  serializedObject() {
    return {
      name: this.name,
      email: this.email,
      role: this.role
    };
  }
}
