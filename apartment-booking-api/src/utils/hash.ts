import bcrypt from 'bcryptjs';

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (input: string, hash:string): Promise<boolean> => {
  return await bcrypt.compare(input, hash);
};