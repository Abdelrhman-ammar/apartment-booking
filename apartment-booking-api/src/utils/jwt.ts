import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string || 'jwt-token-key';
let JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string || '1d';

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
