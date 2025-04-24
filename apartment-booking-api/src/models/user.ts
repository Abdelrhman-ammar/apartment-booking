import { hashPassword, comparePassword } from '../utils/hash';

export interface UserParams {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role?: 'USER' | 'ADMIN' | 'OWNER';
}

const validRoles = ['USER', 'ADMIN', 'OWNER'];

export default class User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role?: 'USER' | 'ADMIN' | 'OWNER';

  constructor({id, name, email, phone, password = '', role = 'USER' }: UserParams) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role;
  }

  static validate({ name, email, phone, password, role }: UserParams): string | null {
    let error: string;
  
    const validators = [
      {
        valid: !!name && !!email && !!phone && !!password,
        message: 'Name, email, phone, and password are required.'
      },
      {
        valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: 'Invalid email format.'
      },
      {
        valid: /^01[0125][0-9]{8}$/.test(phone),
        message: 'Invalid Egyptian phone number.'
      },
      {
        valid: password && password.length >= 6,
        message: 'Password must be at least 6 characters.'
      },
      {
        valid: !role || validRoles.includes(role),
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      }
    ];
  
    for (const { valid, message } of validators) {
      if (!valid) {
        error = message
        return message;
      }
    }
    return null;
  }
  


  async hashPassword(): Promise<void> {
    if(!this.password) {return}
    this.password = await hashPassword(this.password);
  }

  toObject(): UserParams {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role,
    };
  }

  serializedObject(): UserParams {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role
    };
  }
}