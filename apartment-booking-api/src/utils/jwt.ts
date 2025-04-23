import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt-token-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export function generateToken(payload: object) {
  // return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return "m";
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
