import { hashPassword, comparePassword } from '../utils/hash';

export interface UserParams {
  name: string;
  email: string;
  password?: string;
  role?: 'USER' | 'ADMIN' | 'OWNER';
}

export default class User {
  name: string;
  email: string;
  password?: string;
  role?: 'USER' | 'ADMIN' | 'OWNER';

  constructor({ name, email, password = '', role = 'USER' }: UserParams) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static validate({ name, email, password, role }: UserParams): void {
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


  async hashPassword(): Promise<void> {
    if(!this.password) {return}
    this.password = await hashPassword(this.password);
  }

  toObject(): UserParams{
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
    };
  }

  serializedObject(): UserParams{
    return {
      name: this.name,
      email: this.email,
      role: this.role
    };
  }
}